import React from 'react';
import LocalSearch from "@/components/search/LocalSeaarch";
import {SearchParams} from "@/app/(root)/lobby/page";
import CardSection from "@/components/cards/CardSection";
import CardsFilter from "@/components/filters/CardsFilter";
import {getAllCards} from "@/lib/actions/card.action";

const CardsPage = async ({searchParams}: SearchParams) => {

    const {query, filter, page, pageSize, cardType} = await searchParams

    const {success, data, error} = await getAllCards({
        query: query || "",
        filter: filter || "",
        pageSize: Number(pageSize) || 20,
        page: Number(page) || 1,
        cardType: cardType || "all"
    });

    return (
        <>
          <section>
                <LocalSearch placeholder={'Search'} route={'/cards'} />
                <CardsFilter />
          </section>
            <section>
                <CardSection data={data} error={error} success={success} />
            </section>
        </>
    );
};

export default CardsPage;