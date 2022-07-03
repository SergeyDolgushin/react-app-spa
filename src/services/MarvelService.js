import { useHttp } from '../hooks/http.hook'


const useMarvelService = () => {
    const { loading, request, error, clearError } = useHttp();

    const _apiBase = 'http://gateway.marvel.com/v1/public/';
    const _apiKey = 'apikey=997bb8aac491739cb51516491f5f7d2f';
    const _baseOffset = 210;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_adaptDatafromServer);
    }

    const getAllComics = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_adaptComicsDatafromServer);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _adaptDatafromServer(res.data.results[0]);
    }

    const _adaptDatafromServer = (item) => {
        return {
            name: item.name,
            description: item.description,
            thumbnail: item.thumbnail.path + '.' + item.thumbnail.extension,
            homepage: item.urls[0],
            wiki: item.urls[1],
            id: item.id,
            comics: item.comics.items
        }
    }

    const _adaptComicsDatafromServer = (item) => {
        return {
            name: item.title,
            description: item.description,
            thumbnail: item.thumbnail.path + '.' + item.thumbnail.extension,
            homepage: item.urls[0].url,
            id: item.id,
            // comics: item.comics.items
        }
    }

    return { loading, error, getAllCharacters, getCharacter, clearError, getAllComics };
}

export default useMarvelService;