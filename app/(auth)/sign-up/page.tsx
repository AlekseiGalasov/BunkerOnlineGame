'use client'

import React from 'react';
import AuthForm from "@/components/forms/AuthForm";
import {SignInSchema} from "@/lib/validations/validations";
import {loginWithCredentials} from "@/lib/actions/auth.action";

const SignUpPage = () => {
    return (
        <AuthForm
            formType={'SIGN_UP'}
            defaultValues={{email: '', password: ''}}
            schema={SignInSchema}
            onSubmit={loginWithCredentials}
        />
    );
};

export default SignUpPage;