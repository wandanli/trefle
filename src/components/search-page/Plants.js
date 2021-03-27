import React, { useState, useEffect, Fragment, useContext } from "react";
import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { usePromiseTracker } from "react-promise-tracker";
import PlantCard from "./PlantCard";
import { Wrapper, Image } from "../../theme/globalStyle";
import PageButton from "./PageButton";
import LoadingSpinner from "../../images/Spinner-2s-200px.svg";
import { SearchContext } from "./SearchPage";

const Plants = () => {
  const [plants, setPlants] = useState([]);
  const [page, setPage] = useState(1);
  const { promiseInProgress } = usePromiseTracker();
  const { search, query } = useContext(SearchContext);
  const [stateSearch, setStateSearch] = search;
  const [stateQuery, setStateQuery] = query;
  //   const [specie, setSpecie] = useState({});
  const getPlants = async () => {
    try {
      const JWTResponse = await axios.get(
        "https://scandalous-classic-wolverine.glitch.me"
      );
      const JWT = JWTResponse.data.token;
      const baseUrl = `${
        stateQuery
          ? "https://trefle.io/api/v1/plants/search"
          : "https://trefle.io/api/v1/plants"
      }`;
      const plantsResponse = await axios.get(baseUrl, {
        params: {
          q: stateQuery,
          token: JWT,
          page: page,
        },
      });
      setPlants(plantsResponse.data.data);
      console.log(plants);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    trackPromise(getPlants());
  }, [stateQuery, page]);

  const handleClick = (arrow) => {
    if (arrow === "right") {
      setPage(page + 1);
    }
    if (arrow === "left" && page > 1) {
      setPage(page - 1);
    }
    if (arrow === "left" && page === 1) {
      alert("It's already the first page.");
    }
  };

  return (
    <Fragment>
      <Wrapper>
        {promiseInProgress === true ? (
          <Image width="100" height="100" src={LoadingSpinner}></Image>
        ) : null}
      </Wrapper>
      <Wrapper margin="40px 10px 20px 10px">
        {plants.map((plant, index) => (
          <PlantCard
            key={index}
            name={plant.common_name}
            image={plant.image_url}
            family={plant.family}
            genus={plant.genus}
            link={plant.links.plant}
          />
        ))}
      </Wrapper>
      <PageButton handleClick={handleClick} />
    </Fragment>
  );
};

export default Plants;
