import React from 'react';
import CreateLobbyForm from "@/components/forms/CreateLobbyForm";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {ROUTES} from "@/constants/route";
import FormWrapper from "@/components/formWrapper/FormWrapper";
import {getAllScenariosForSelect} from "@/lib/actions/scenario.action";

const CreateLobbyPage = async () => {

    const session = await auth()

    if (!session) return redirect(ROUTES.SIGN_IN);

    const { data: scenariosData } = await getAllScenariosForSelect({
        pageSize: 10,
        page: 1,
    })

    const { scenarios } = scenariosData as { scenario: IScenario[] }

    return (
        <FormWrapper
            header='Create Bunker'
            text='Set up a shelter before a disaster'
            headerImage='🚪'
        >
            <CreateLobbyForm scenarios={scenarios} />
        </FormWrapper>
    );
};

export default CreateLobbyPage;