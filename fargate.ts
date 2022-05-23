import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as pulumicdk from "@pulumi/cdk";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import { Construct } from "constructs";
import { Stack, Duration, CfnOutput } from "aws-cdk-lib";
import { remapCloudControlResource } from "./adapter";

export interface FargateWebAppArgs {
  image: string;
}

export class FargateWebApp extends pulumi.ComponentResource {
  constructor(
    name: string,
    args: FargateWebAppArgs,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super("jaxxstorm:index:fargatewebapp", name, {}, opts);

    const stack = new FargateStack(name, args.image);
  }
}

class FargateStack extends pulumicdk.Stack {
  loadBalancerDNS: pulumi.Output<string>;

  constructor(name: string, image: string, options?: pulumicdk.StackOptions) {
    super(name, { ...options, remapCloudControlResource });

    // Create VPC and Fargate Cluster
    // NOTE: Limit AZs to avoid reaching resource quotas
    const vpc = new ec2.Vpc(this, `${name}-vpc`, { maxAzs: 2 });
    const cluster = new ecs.Cluster(this, `${name}-cluster`, {
      vpc,
    });

    // Create Fargate Service
    const fargateService = new ecs_patterns.NetworkLoadBalancedFargateService(
      this,
      `${name}-svc`,
      {
        cluster,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry(image),
        },
      }
    );

    // Setup AutoScaling policy
    const scaling = fargateService.service.autoScaleTaskCount({
      maxCapacity: 2,
    });
    scaling.scaleOnCpuUtilization(`${name}-scalingconfig`, {
      targetUtilizationPercent: 50,
      scaleInCooldown: Duration.seconds(60),
      scaleOutCooldown: Duration.seconds(60),
    });

    this.loadBalancerDNS = this.asOutput(
      fargateService.loadBalancer.loadBalancerDnsName
    );

    // Finalize the stack and deploy its resources.
    this.synth();
  }
}
