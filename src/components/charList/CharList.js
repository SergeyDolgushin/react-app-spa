import { Component } from 'react';
import { PropTypes } from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage';

import './charList.scss';

const View = ({ character, onCharSelected }) => {
    const { name, thumbnail } = character;
    let imgStyle = { 'objectFit': 'cover' };

    if (character.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = { 'objectFit': 'unset' };
    }
    return (
        <li className="char__item" onClick={() => onCharSelected(character.id)}>
            <img src={thumbnail} alt={name} style={imgStyle} />
            <div className="char__name">{name}</div>
        </li>
    )
}

class CharList extends Component {
    state = {
        characters: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 220,
        endedList: false,
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.loadCharacters();
    }

    elements = (items) => {
        const elements = items.map(item => {
            return (<View character={item} key={item.id} onCharSelected={this.props.onCharSelected} />);
        });

        return (
            <ul className="char__grid">
                {elements}
            </ul>
        )
    }

    onCharactersLoaded = (newCharacters) => {
        let ended = false;
        if (newCharacters.length < 9) {
            ended = true;
        }

        this.setState(({ offset, characters }) => ({
            characters: [...characters, ...newCharacters],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            endedList: ended
        }))
    }

    newCharactersLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }


    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    loadCharacters = () => {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.newCharactersLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharactersLoaded)
            .catch(this.onError);
    }

    render() {
        const { characters, loading, error, offset, newItemLoading, endedList } = this.state;

        const views = this.elements(characters);
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? views : null;



        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{ 'display': endedList ? 'none' : 'block' }}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList;