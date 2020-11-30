import React, { useState } from 'react';

export const useAlertQuestion = () => {

    const [openAlert, setOpenAlert] = useState(false);

    return {
        setOpenAlert,
        openAlert
    }
}