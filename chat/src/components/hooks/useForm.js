import React, { useState } from 'react';

export const useForm = (initialFormValues, validateOnChange = false, validate) => {

    const [values, setValues] = useState(initialFormValues);
    const [errors, setErrors] = useState({});
    
    const handleInputChange = e => {
        const {name, value} = e.target;
        setValues({
          ...values,
          [name]: value 
        })

        if (validateOnChange) {
            validate({[name]: value});
        }
    }

    return {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange
    }
}