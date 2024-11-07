import React, { createContext, useContext, useState, ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import Box from '@mui/material/Box';

interface AlertMessage {
    id: number;
    severity: AlertColor;
    message: string;
}

interface AlertContextType {
    pushAlert: (severity: AlertColor, message: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = (): AlertContextType => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [alerts, setAlerts] = useState<AlertMessage[]>([]);

    const closeAlert = (id: number) => {
        setAlerts(prevAlerts => prevAlerts.filter((alert) => alert.id !== id));
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlerts([]);
    };

    const pushAlert = (severity: AlertColor, message: string) => {
        const id = Date.now(); // Use timestamp as a unique ID
        setAlerts(prevAlerts => {
            const newAlert = { id, severity, message };
            const newAlerts = [...prevAlerts, newAlert];

            // auto close the alert after 2 seconds
            setTimeout(() => closeAlert(id), 2000);

            return newAlerts;
        });
    };


    return (
        <AlertContext.Provider value={{ pushAlert }}>
            {children}
            <Snackbar open={alerts.length > 0} onClose={handleClose}>
                <Box sx={{ width: '100%' }}>
                    {alerts.map((alert) => (
                        <Box key={alert.id} mb={2}>
                            <Alert severity={alert.severity} variant='filled' onClose={() => closeAlert(alert.id)}>
                                {alert.message}
                            </Alert>
                        </Box>
                    ))}
                </Box>
            </Snackbar>
        </AlertContext.Provider>
    );
};
