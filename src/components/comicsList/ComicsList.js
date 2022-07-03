import './comicsList.scss';
import uw from '../../resources/img/UW.png';
import xMen from '../../resources/img/x-men.png';

import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import useMarvelService from '../../services/MarvelService';

const ComicsList = (props) => {
    const [charList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setComicsEnded] = useState(false);

    const { loading, error, getAllComics } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
            .then(onComicsListLoaded)
    }

    const onComicsListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 8) {
            ended = true;
        }

        setComicsList(charList => [...charList, ...newCharList]);
        setNewItemLoading(false);
        setOffset(offset => offset + 8);
        setComicsEnded(ended);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {

        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = { 'objectFit': 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' };
            }

            return (
                <li
                    className="comics__item"
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    key={item.id}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}>
                    <a href={item.homepage}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img" style={imgStyle} />
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">9.99$</div>
                    </a>
                </li>
            )
        });

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading && !newItemLoading ? <Spinner /> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{ 'display': charEnded ? 'none' : 'block' }}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

ComicsList.propTypes = {
    onComicsSelected: PropTypes.func.isRequired
}


export default ComicsList;