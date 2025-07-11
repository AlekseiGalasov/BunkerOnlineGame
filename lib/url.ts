import qs from 'query-string'

interface UrlQueryParams {
    params: string
    key: string
    value: string
}

interface RemoveUrlQueryParams {
    params: string
    keysToRemove: string[]
}

interface addAndRemoveKeysFromQueryParams {
    params: string
    key: string
    value: string
    keysToRemove: string[]
}

export const LOCAL_SEARCH_DELAY = 300;

export const formUrlQuery = ({params, key, value}: UrlQueryParams) => {
    const currentUrl = qs.parse(params)
    currentUrl[key] = value

    return qs.stringifyUrl({
        url: window.location.pathname,
        query: currentUrl
    })
}


export const addAndRemoveKeysFromQuery = ({params, key, value, keysToRemove}: addAndRemoveKeysFromQueryParams) => {
    const currentUrl = qs.parse(params)
    keysToRemove.forEach(key => {
        delete currentUrl[key]
    })
    currentUrl[key] = value
    return qs.stringifyUrl({
        url: window.location.pathname,
        query: currentUrl
    }, {skipNull: true})
}

export const removeKeysFromQuery = ({params, keysToRemove}: RemoveUrlQueryParams) => {
    const currentUrl = qs.parse(params)

    keysToRemove.forEach(key => {
        delete currentUrl[key]
    })

    return qs.stringifyUrl({
        url: window.location.pathname,
        query: currentUrl
    }, {skipNull: true})
}