'use client'

import React from 'react';
import AuthForm from "@/components/forms/AuthForm";
import { SignUpSchema} from "@/lib/validations/validations";
import {authWithCredentials} from "@/lib/actions/auth.action";

const SignInPage = () => {
    return (
        <AuthForm
            formType={'SIGN_IN'}
            defaultValues={{email: '', username: '', password: ''}}
            schema={SignUpSchema}
            onSubmit={authWithCredentials}
        />
    );
};

export default SignInPage;