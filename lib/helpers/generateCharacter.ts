import Card, {CARD_RULES, CardType, ICardDoc} from "@/models/Card.model";
import {ICharacterDoc} from "@/models/Character.model";
import {redisClient} from "@/lib/redis";

export async function prepareCardPools() {

    const pools: Record<CardType, ICardDoc[]> = {};

    await Promise.all(
        Object.keys(CARD_RULES).map(async (type) => {
            pools[type as CardType] = await Card.find({ type });
        })
    );

    return pools;
}

export function randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function dealCards(pools: Record<CardType, ICardDoc[]>, players: number) {
    const usedUniqueCards = new Map<CardType, Set<string>>();
    const result: Record<CardType, ICardDoc[]> = {};

    (Object.keys(CARD_RULES) as CardType[]).forEach((type) => {
        const rule = CARD_RULES[type];
        result[type] = [];

        if (rule.unique) {
            const available = pools[type].filter(card =>
                !usedUniqueCards.get(type)?.has(card._id.toString())
            );

            for (let i = 0; i < players; i++) {
                const randomIndex = Math.floor(Math.random() * available.length);
                const card = available.splice(randomIndex, 1)[0];
                result[type].push(card);

                if (!usedUniqueCards.has(type)) {
                    usedUniqueCards.set(type, new Set());
                }
                usedUniqueCards.get(type)!.add(card._id.toString());
            }
        } else {
            for (let i = 0; i < players; i++) {
                const randomIndex = Math.floor(Math.random() * pools[type].length);
                result[type].push(pools[type][randomIndex]);
            }
        }
    });

    return result;
}

export async function cacheCharacter(character: ICharacterDoc) {
    const key = `character:${character.lobbyId}:${character.userId}`;
    await redisClient.set(key, JSON.stringify(character), "EX", 60 * 60);
    await redisClient.sadd(`lobby:${character.lobbyId}:characters`, key, "EX", 60 * 60);
}