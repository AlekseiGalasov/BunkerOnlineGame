import React from 'react';
import CardForm from "@/components/forms/CardForm";
import FormWrapper from "@/components/formWrapper/FormWrapper";
import {createCard} from "@/lib/actions/card.action";
import {getAllScenariosForSelect} from "@/lib/actions/scenario.action";
import {ITag} from "@/models/Tag.model";
import {getAllTagsForSelect} from "@/lib/actions/tag.action";
import {IScenario} from "@/models/Scenario.model";

const Page = async () => {

    const { data: scenariosData } = await getAllScenariosForSelect({
        pageSize: 10,
        page: 1,
    })

    const { data: tagsData } = await getAllTagsForSelect({
        pageSize: 10,
        page: 1,
    })

    const { scenarios } = scenariosData as { scenarios: IScenario[] }
    const { tags } = tagsData as { tags: ITag[] }

    const defaultScenario = scenarios.map(elem => {
        return {...elem, checked: false}
    })

    const defaultValues: CardParams = {
            name: '',
            description: '',
            level: 1,
            type: 'profession',
            scenario: defaultScenario,
            tags: []
    }

    return (
        <FormWrapper
            header='Creating a game card'
            text='Creating new cards will help make the gaming
            experience more unique, will help to better immerse you
            rself in each adventure due to the individuality of the cards for a specific scenario.'
            headerImage='🎮'
        >
            <CardForm
                onSubmit={createCard}
                defaultValues={defaultValues}
                tags={tags}
                formType={'Create'}
            />
        </FormWrapper>
    );
};

export default Page;