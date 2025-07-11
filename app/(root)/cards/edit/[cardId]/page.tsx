import React from 'react';
import CardForm from "@/components/forms/CardForm";
import {createCard, editCard, getCardById} from "@/lib/actions/card.action";
import {notFound, redirect} from "next/navigation";
import {auth} from "@/auth";
import FormWrapper from "@/components/formWrapper/FormWrapper";
import {ICard} from "@/models/Card.model";
import {getAllScenariosForSelect} from "@/lib/actions/scenario.action";
import {getAllTagsForSelect} from "@/lib/actions/tag.action";
import {ITag} from "@/models/Tag.model";

const EditPage = async ({params}: { params: Promise<{ cardId: string }> }) => {

        const {cardId} = await params

        if (!cardId) return notFound();

        const session = await auth()

        if (!session) {
            return redirect("/sign-in");
        }

        const {data: cards, success: cardsSuccess, error: cardsError} = await getCardById({id: cardId})
        const {card} = cards as { card: ICard }

        const {data: scenariosData, success: scenariosSuccess, error: scenariosError} = await getAllScenariosForSelect({
            pageSize: 10,
            page: 1,
        })

        const { data: tagsData } = await getAllTagsForSelect({
            pageSize: 10,
            page: 1,
        })

        const {scenarios} = scenariosData as { scenario: IScenario[] }
        const { tags } = tagsData as { tags: ITag[] }

        if (!card) {
            return notFound()
        }

        const defaultScenario = scenarios.map(elem => {
            if (card.scenarios.includes(elem._id)) {
                return {...elem, checked: true}
            } else {
                return {...elem, checked: false}
            }
        })

        const defaultValues: CardParams = {
            name: card.name,
            description: card.description,
            level: card.level,
            type: card.type,
            scenario: defaultScenario,
            tags: card.tags
        }

        return (
            <FormWrapper header='Edit card' text='Edit card' headerImage='🎮'>
                <CardForm
                    onSubmit={editCard}
                    defaultValues={defaultValues}
                    formType={'Edit'}
                    id={card._id}
                    tags={tags}
                />
            </FormWrapper>
        );
    }
;

export default EditPage;