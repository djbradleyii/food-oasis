import React, { useCallback, useEffect } from "react";
import Search from "../components/Search";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Select,
  MenuItem,
  FormControl,
  Button,
  Box,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import {
  MEAL_PROGRAM_CATEGORY_ID,
  FOOD_PANTRY_CATEGORY_ID,
  DEFAULT_CATEGORIES,
} from "../constants/stakeholder";

const useStyles = makeStyles((theme) => ({
  filterGroup: {
    margin: 0,
    padding: 0,
  },
  filterGroupButton: {
    margin: 0,
    padding: ".5rem",
    fontSize: "max(.8vw,12px)",
    whiteSpace: "nowrap",
    backgroundColor: "#fff",
    border: ".1em solid #000",
    color: "#000",
    [theme.breakpoints.down("xs")]: {
      padding: ".1rem .1rem",
      margin: "0",
      fontSize: "max(.8vw,11px)",
    },
  },
  filterButton: {
    margin: 0,
    padding: ".5rem",
    fontSize: "max(.8vw,12px)",
    whiteSpace: "nowrap",
    backgroundColor: "#fff",
    border: ".1em solid #000",
    color: "#000",
    [theme.breakpoints.down("xs")]: {
      padding: ".6rem .6rem",
      margin: ".3rem",
      marginTop: "1rem",
      fontSize: "max(.8vw,12px)",
      borderRadius: "5px !important",
    },
  },
  distanceControl: {
    margin: ".3rem",
    backgroundColor: "#fff",
    // padding: "auto 0 auto .7em",
    padding: ".3rem",
    border: ".1em solid #000",
    outline: "none",
    [theme.breakpoints.down("xs")]: {
      padding: ".4rem",
      margin: ".3rem",
      marginTop: "1rem",
    },
  },
  menuItems: {
    fontSize: "max(.8vw,12px)",
    color: "#000",
  },
  controlPanel: {
    backgroundColor: "#336699",
    padding: "1rem 0",
    flex: "1 0 auto",
  },
  inputHolder: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  input: {
    fontSize: "12px",
    width: "25em",
    height: "2em",
    outline: "none",
    padding: ".25em",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    width: 32,
    height: 32,
  },
  submit: {
    height: "40px",
    minWidth: "25px",
    backgroundColor: "#BCE76D",
    borderRadius: "0 6px 6px 0",
    boxShadow: "none",
    "& .MuiButton-startIcon": {
      marginRight: 0,
    },
    "&.Mui-disabled": {
      backgroundColor: "#BCE76D",
      opacity: 0.8,
    },
    "&:hover": {
      backgroundColor: "#C7F573",
      boxShadow: "none",
    },
    [theme.breakpoints.down("xs")]: {
      marginRight: ".5rem",
    },
  },
  buttonHolder: {
    display: "flex",
  },
}));

const distanceInfo = [1, 2, 3, 5, 10, 20, 50];

const ResultsFilters = ({
  search,
  isWindowWide,
  viewport,
  setViewport,
  setIsPopupOpen,
  doSelectStakeholder,
  origin,
  setOrigin,
  radius,
  setRadius,
  isVerifiedSelected,
  selectVerified,
  userCoordinates,
  categoryIds,
  toggleCategory,
  viewPortHash,
}) => {
  const classes = useStyles();

  const isMealsSelected = categoryIds.indexOf(MEAL_PROGRAM_CATEGORY_ID) >= 0;
  const isPantrySelected = categoryIds.indexOf(FOOD_PANTRY_CATEGORY_ID) >= 0;

  const doHandleSearch = useCallback(
    (e) => {
      if (e) {
        e.preventDefault();
      }
      const storage = window.sessionStorage;
      search({
        latitude:
          origin.latitude ||
          userCoordinates.latitude ||
          JSON.parse(storage.origin).latitude,
        longitude:
          origin.longitude ||
          userCoordinates.longitude ||
          JSON.parse(storage.origin).longitude,
        radius,
        categoryIds: categoryIds.length ? categoryIds : DEFAULT_CATEGORIES,
        isInactive: "either",
        verificationStatusId: 0,
      });
      if (origin.locationName && origin.latitude && origin.longitude)
        storage.origin = JSON.stringify({
          locationName: origin.locationName,
          latitude: origin.latitude,
          longitude: origin.longitude,
        });

      storage.categoryIds = JSON.stringify(categoryIds);
      storage.radius = JSON.stringify(radius);
      storage.verified = JSON.stringify(isVerifiedSelected);
      setViewport({
        zoom: viewPortHash[radius],
        latitude: origin.latitude,
        longitude: origin.longitude,
      });
      setIsPopupOpen(false);
      doSelectStakeholder(null);
    },
    [
      search,
      origin.locationName,
      origin.latitude,
      origin.longitude,
      userCoordinates.latitude,
      userCoordinates.longitude,
      radius,
      categoryIds,
      isVerifiedSelected,
      setViewport,
      setIsPopupOpen,
      doSelectStakeholder,
      viewPortHash,
    ]
  );

  const toggleMeal = useCallback(() => {
    toggleCategory(MEAL_PROGRAM_CATEGORY_ID);
  }, [toggleCategory]);

  const togglePantry = useCallback(() => {
    toggleCategory(FOOD_PANTRY_CATEGORY_ID);
  }, [toggleCategory]);

  useEffect(() => {
    doHandleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radius, categoryIds, isVerifiedSelected, toggleCategory]);

  const handleDistanceChange = (distance) => {
    setRadius(distance);
    setViewport({
      ...viewport,
      zoom: viewPortHash[distance],
    });
  };

  return (
    <Grid
      item
      container
      wrap="wrap-reverse"
      className={classes.controlPanel}
      style={{
        justifyContent: isWindowWide ? null : "center",
      }}
    >
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        justify="center"
        alignItems="center"
        className={classes.buttonHolder}
      >
        <Grid item>
          <Button as={FormControl} className={classes.distanceControl}>
            <Select
              name="select-distance"
              disableUnderline
              value={radius}
              onChange={(e) => handleDistanceChange(e.target.value)}
              inputProps={{
                name: "select-distance",
                id: "select-distance",
              }}
              className={classes.menuItems}
            >
              <MenuItem key={0} value={0} className={classes.menuItems}>
                DISTANCE
              </MenuItem>
              {distanceInfo.map((distance) => (
                <MenuItem
                  key={distance}
                  value={distance}
                  className={classes.menuItems}
                >
                  {`${distance} MILE${distance > 1 ? "S" : ""}`}
                </MenuItem>
              ))}
            </Select>
          </Button>
        </Grid>
        <Grid item>
          <Button
            className={classes.filterButton}
            style={{
              backgroundColor: isPantrySelected ? "#0A3865" : "#fff",
              color: isPantrySelected ? "#fff" : "#000",
              marginLeft: "0.25rem",
              borderRadius: "5px 0 0 5px",
            }}
            onClick={togglePantry}
          >
            Food Pantries
          </Button>
        </Grid>
        <Grid item>
          <Button
            className={classes.filterButton}
            style={{
              backgroundColor: isMealsSelected ? "#0A3865" : "#fff",
              color: isMealsSelected ? "#fff" : "#000",
              marginRight: "0.25rem",
              borderRadius: "0 5px 5px 0",
            }}
            onClick={toggleMeal}
          >
            Meals
          </Button>
        </Grid>
        <Grid item>
          {/* <Button
            className={classes.filterGroupButton}
            style={{
              backgroundColor: isVerifiedSelected ? "#0A3865" : "#fff",
              color: isVerifiedSelected ? "#fff" : "#000",
            }}
            onClick={() => {
              selectVerified(!isVerifiedSelected);
            }}
          >
            Updated Data
          </Button> */}
        </Grid>
      </Grid>
      <Box
        className={classes.inputContainer}
        style={{ width: isWindowWide ? "30rem" : "100%" }}
      >
        <form
          noValidate
          onSubmit={(e) => doHandleSearch(e)}
          style={{ all: "inherit" }}
        >
          <Search
            userCoordinates={userCoordinates}
            setOrigin={setOrigin}
            origin={origin}
          />
          <Button
            type="submit"
            disabled={!origin}
            variant="contained"
            className={classes.submit}
            startIcon={
              <SearchIcon fontSize="large" className={classes.searchIcon} />
            }
          />
        </form>
      </Box>
    </Grid>
  );
};

ResultsFilters.propTypes = {
  distance: PropTypes.number,
  placeName: PropTypes.string,
  isPantryCategorySelected: PropTypes.bool,
  isMealCategorySelected: PropTypes.bool,
  isVerifiedFilterSelected: PropTypes.bool,
  search: PropTypes.func,
};

export default ResultsFilters;
