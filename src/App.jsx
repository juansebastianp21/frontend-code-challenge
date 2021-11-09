import React, { useState } from "react";
import "./App.css";

const URL_PATH =
    "https://raw.githubusercontent.com/joseluisq/pokemons/master/pokemons.json";

const App = () => {
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [filteredPokemonList, setFilteredPokemonList] = useState([]);

    const handleInputChange = async (e) => {
        setLoading(true);
        const value = e.target.value.toLowerCase();
        setSearchText(value);
        const pokemonList = await fetch(URL_PATH)
            .then((r) => r.json())
            .then((r) => r.results);
        const filteredList = pokemonList.filter((item) => {
            return (
                item.name.toLowerCase().includes(value) ||
                item.type.some((type) => type.toLowerCase().includes(value))
            );
        });
        const sortedList = filteredList.sort((a, b) => {
            if (
                a.name.toLowerCase().includes(value) &&
                b.type.some((type) => type.toLowerCase().includes(value))
            ) {
                return -1;
            }
            if (
                b.name.toLowerCase().includes(value) &&
                a.type.some((type) => type.toLowerCase().includes(value))
            ) {
                return 1;
            }
            return 0;
        });
        const shortList = sortedList.slice(0, 4);
        setFilteredPokemonList(shortList);
        console.log(shortList);
        setLoading(false);
    };
    return (
        <>
            <label htmlFor="maxCP" className="max-cp">
                <input type="checkbox" id="maxCP" />
                <small>Maximum Combat Points</small>
            </label>
            <input
                type="text"
                className="input"
                placeholder="Pokemon or type"
                onChange={handleInputChange}
            />
            {loading && <div className="loader"></div>}
            {filteredPokemonList.length === 0 && (
                <li>
                    <img
                        src="https://cyndiquil721.files.wordpress.com/2014/02/missingno.png"
                        alt=""
                    />
                    <div className="info">
                        <h1 className="no-results">No results</h1>
                    </div>
                </li>
            )}
            <ul className="suggestions">
                {filteredPokemonList.map((item) => {
                    const parts = item.name.split(
                        new RegExp(`(${searchText})`, "gi")
                    );
                    return (
                        <li>
                            <img src={item.sprites.normal} alt="" />
                            <div className="info">
                                <h1>
                                    {parts.map((part, index) => {
                                        const isHighLighted =
                                            part.toLowerCase() === searchText;
                                        return (
                                            <span
                                                key={index}
                                                className={
                                                    isHighLighted ? "hl" : ""
                                                }
                                            >
                                                {part}
                                            </span>
                                        );
                                    })}
                                </h1>
                                {item.type.map((type) => (
                                    <span
                                        className={`type ${type.toLowerCase()}`}
                                    >
                                        {type}
                                    </span>
                                ))}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </>
    );
};

export default App;
