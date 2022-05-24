import "./styles.css";
import {
    FormControl,
    TextField,
    Button,
    Tabs,
    Tab,
    Box,
    CircularProgress,
    Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "rgb(128, 90, 195)",
        },
    },
});

export default function App() {
    const defaultValues = {
        id: "",
        image: "",
    };

    const [formValues, setFormValues] = useState(defaultValues);
    const [sites, setSites] = useState([]);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        (async () => {
            if (tabValue === 1) {
                getSites();
            }
        })();

        setDeleteMessage(null);
        setSuccessMessage(null);
        setFailureMessage(null);
    }, [tabValue]);

    const [isLoading, setIsLoading] = useState(false);

    const [deleteMessage, setDeleteMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [failureMessage, setFailureMessage] = useState(null);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    async function handleCreateSite() {
        setIsLoading(true);

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            accept: "application/json",
            body: JSON.stringify({ id: formValues.id, image: formValues.image }),
            mode: "cors",
        };

        try {
            return await fetch("http://localhost:1337/sites", requestOptions)
                .then((response) => response.json())
                .then((data) => setSites(data.sites))
                .then(() => setIsLoading(false))
                .then(() => setSuccessMessage(`The ${formValues.id} site has been successfully created.`))
                .then(() => setFormValues(defaultValues));
        } catch {
            setIsLoading(false);
            setFailureMessage(`The ${formValues.id} site creation has failed. See your console for more details.`);
        }
    }

    const getSites = () => {
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };

        fetch("http://localhost:1337/sites", requestOptions)
            .then((response) => response.json())
            .then((data) => setSites(data.ids));
    };

    async function handleDeleteSite(siteID) {
        setIsLoading(true);

        const requestOptions = {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: siteID }),
        };

        try {
            return await fetch(`http://localhost:1337/sites/${siteID}`, requestOptions)
                .then(() => setIsLoading(false))
                .then(() => setDeleteMessage(`The ${siteID} site has been deleted.`))
                .then(() => setSites(sites.filter((site) => site !== siteID)));
        } catch {
            setIsLoading(false);
            setFailureMessage(`The ${formValues.id} site deletion has failed. See your console for more details.`);
        }
    }

    const DeleteMessage = () => {
        return (
            <Alert
                sx={{
                    width: "100%",
                    marginBottom: "10px",
                }}
                severity="error"
            >
                {deleteMessage}
            </Alert>
        );
    };

    const SuccessMessage = () => {
        return (
            <Alert
                sx={{
                    width: "100%",
                }}
                severity="success"
            >
                {successMessage}
            </Alert>
        );
    };

    const FailureMessage = () => {
        return (
            <Alert
                sx={{
                    width: "100%",
                }}
                severity="error"
            >
                {failureMessage}
            </Alert>
        );
    };

    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src="../assets/lightningpus.svg" style={{ height: "150px" }} />
                    <h1
                        style={{
                            background:
                                "linear-gradient(90deg, #f7bf2a 0%, #f26e7e 18.23%, #be5188 38.02%, #8a3391 53.65%, #805ac3 74.48%, #7682f4 100%)",
                            WebkitTextFillColor: "transparent",
                            WebkitBackgroundClip: "text",
                        }}
                    >
                        AWS CDK Over HTTP{" "}
                    </h1>
                </div>

                <Box sx={{ width: "100%" }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs centered value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                            <Tab label="Create a site" />
                            <Tab label="Delete a site" />
                        </Tabs>
                    </Box>
                    <div
                        role="tabpanel"
                        hidden={tabValue !== 0}
                        id={`simple-tabpanel-${0}`}
                        aria-labelledby={`simple-tab-${0}`}
                    >
                        {tabValue === 0 && (
                            <Box sx={{ p: 3 }}>
                                {successMessage && <SuccessMessage />}
                                {failureMessage && <FailureMessage />}
                                <FormControl sx={{ width: 400 }}>
                                    <TextField
                                        sx={{ marginTop: 3 }}
                                        required
                                        id="outlined-basic"
                                        name="id"
                                        label="ID"
                                        variant="outlined"
                                        onChange={handleInputChange}
                                    />
                                    <TextField
                                        sx={{ marginTop: 3, marginBottom: 3 }}
                                        required
                                        id="outlined-basic"
                                        name="image"
                                        label="Image"
                                        variant="outlined"
                                        onChange={handleInputChange}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleCreateSite}
                                        disabled={isLoading}
                                        sx={{
                                            height: 50,
                                            width: 200,
                                            alignSelf: "center",
                                            textTransform: "none",
                                            fontSize: "1.25rem",
                                            background: "linear-gradient(90deg,#be5188,#805ac3)",
                                        }}
                                    >
                                        {isLoading && <CircularProgress sx={{ color: "white" }} size={20} />}
                                        {!isLoading && "Create site"}
                                    </Button>
                                </FormControl>
                            </Box>
                        )}
                    </div>

                    <div
                        role="tabpanel"
                        hidden={tabValue !== 1}
                        id={`simple-tabpanel-${1}`}
                        aria-labelledby={`simple-tab-${1}`}
                    >
                        {tabValue === 1 && (
                            <Box sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                {deleteMessage && <DeleteMessage />}

                                {sites &&
                                    sites.length > 0 &&
                                    sites.map((site, index) => (
                                        <Box sx={{ width: 400 }}>
                                            <Button
                                                sx={{
                                                    height: 50,
                                                    width: 200,
                                                    marginTop: 3,
                                                    textTransform: "none",
                                                    fontSize: "1.25rem",
                                                }}
                                                color="error"
                                                variant="contained"
                                                onClick={() => handleDeleteSite(site)}
                                                disabled={isLoading}
                                            >
                                                {isLoading && <CircularProgress size={20} />}
                                                {!isLoading && `Delete ${site}`}
                                            </Button>
                                        </Box>
                                    ))}

                                {sites && !sites.length && (
                                    <Alert
                                        severity="info"
                                        sx={{
                                            width: "100%",
                                        }}
                                    >
                                        You don't have any sites yet, try selecting "Create a site".
                                    </Alert>
                                )}
                            </Box>
                        )}
                    </div>
                </Box>
            </div>
        </ThemeProvider>
    );
}
