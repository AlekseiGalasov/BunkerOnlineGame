import React from 'react';
import {ROUTES} from "@/constants/route";
import LinkCard from "@/components/cards/LinkCard";

const cards = [
    {imageName: 'lobby', link: ROUTES.CREATE_LOBBY, title: 'Create lobby', text: 'Create a new game lobby, set the rules, invite your friends, and start surviving in the bunker.'},
    {imageName: 'join_lobby', link: ROUTES.LOBBIES, title: 'All lobbies', text: 'Browse all available lobbies. Join an existing game and jump right into the action.'},
    {imageName: 'cards', link: ROUTES.CARDS, title: 'All cards', text: 'Explore all card types in the game — professions, health conditions, hobbies, and more.'},
    {imageName: 'create_card', link: ROUTES.CREATE_CARD, title: 'Create card', text: 'Create your own unique card and add it to the game. Be creative!'},
    {imageName: 'scenarios', link: ROUTES.SCENARIOS, title: 'All scenarios', text: 'View all available game scenarios. Different conditions, stories, and outcomes await.'},
    {
        imageName: 'create_scenario',
        link: ROUTES.CREATE_SCENARIO,
        title: 'Create scenario',
        text: 'Build your own game scenario — from apocalyptic disasters to absurd challenges. Let your imagination run wild.'
    },
    {imageName: 'tags', link: ROUTES.TAGS, title: 'All tags', text: 'Browse all available tags.'},
    {imageName: 'create_tag', link: ROUTES.CREATE_TAG, title: 'Create tag/tags', text: 'Add new tags to help set up your cards or scenarios.'}
]

const HomePage = () => {

    return (
        <section className='flex flex-col items-center gap-10 mt-16'>
            <div className='flex gap-4 flex-wrap justify-center'>
                {
                    cards.map(card => (
                        <LinkCard key={card.link} card={card} />
                    ))
                }
            </div>
        </section>
    );
};

export default HomePage;