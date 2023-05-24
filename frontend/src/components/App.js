import { useCallback, useEffect, useState } from "react";
import Header from "./Header";
import Main from "./Main";
import EditProfilePopup from "./EditProfilePopup";
import AddPlacePopup from "./AddPlacePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import ImagePopup from "./ImagePopup";
import Footer from "./Footer";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { api } from "../utils/api";
import * as auth from "../utils/auth";
import { Spinner } from "./Spinner";
import { Route, useNavigate, Routes, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import success from "../images/success.svg";
import fail from "../images/fail.svg";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isCardsLoading, setIsCardsLoading] = useState(true);
  const [isEditProfileChanging, setIsEditProfileChanging] = useState(false);
  const [isAddPlaceChanging, setIsAddPlaceChanging] = useState(false);
  const [isEditAvatarChanging, setIsEditAvatarChanging] = useState(false);
  const [infoTooltipStatus, setInfoTooltipStatus] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [infoText, setInfoText] = useState("");

  const handleTokenCheck = useCallback(async () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      try {
        const user = await api.getInfo(jwt)
        const cards = await api.getInitialCards(jwt)

        if (!user) {
          throw new Error("Данные отсутствуют");
        }
        setCurrentUser(user);
        setCards(cards.data);
        setLoggedIn(true);
        setEmail(user.email);
        navigate("/");
      } catch (e) {
        console.error(e);
      } finally {
        setIsCardsLoading(false);
      }
    } else {
      setIsCardsLoading(false);
    }
  }, [navigate]);


  useEffect(() => {
    handleTokenCheck();
  }, []);

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleCardClick = (card) => {
    setIsImagePopupOpen(true);
    setSelectedCard(card);
  };

  const handleCardDelete = (card) => {
    const jwt = localStorage.getItem("jwt");
    api
      .deleteCard(card._id, jwt)
      .then(() => {
        setCards((state) => state.filter((i) => i._id !== card._id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateUser = (data) => {
    setIsEditProfileChanging(true);
    const jwt = localStorage.getItem('jwt');
    api
      .addInfo(data, jwt)
      .then((newData) => {
        setCurrentUser(newData.data);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsEditProfileChanging(false);
      });
  };

  const handleUpdateAvatar = (data) => {
    setIsEditAvatarChanging(true);
    const jwt = localStorage.getItem('jwt');
    api
      .addAvatar(data, jwt)
      .then((newData) => {
        setCurrentUser(newData.data);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsEditAvatarChanging(false);
      });
  };

  const handleAddPlaceSubmit = (data) => {
    setIsAddPlaceChanging(true);
    const jwt = localStorage.getItem('jwt');
    api
      .createCard(data, jwt)
      .then((newData) => {
        setCards([newData.data, ...cards]);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsAddPlaceChanging(false);
      });
  };

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    const jwt = localStorage.getItem('jwt');
    api
      .changeLikeCardStatus(card._id, !isLiked, jwt)
      .then((newCard) => {
        const newCards = cards.map(c => (c._id === card._id ? newCard.data : c));
        setCards(newCards);

      })
      .catch((error) => {
        console.log(error);
      });
  }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsImagePopupOpen(false);
    setIsInfoTooltipOpen(false);
  };

  const handleLogin = useCallback(
    async (info) => {
      setIsCardsLoading(true);
      try {
        const data = await auth.authorize(info);
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          setLoggedIn(true);
          setEmail(info.email);
          navigate("/", { replace: true });
          handleTokenCheck();
        }
      } catch (e) {
        console.error(e);
        setIsInfoTooltipOpen(true);
        setInfoTooltipStatus(false);
        setInfoText("Что-то пошло не так! Попробуйте ещё раз.");
      } finally {
        setIsCardsLoading(false);
      }
    },
    [navigate]
  );

  const handleRegistration = useCallback(
    async (info) => {
      setIsCardsLoading(true);
      try {
        const data = await auth.register(info);
        if (data) {
          setIsInfoTooltipOpen(true);
          setInfoTooltipStatus(true);
          setInfoText("Вы успешно зарегистрировались!");
          navigate("/sign-in", { replace: true });
        }
      } catch (e) {
        console.error(e);
        setInfoTooltipStatus(false);
        setIsInfoTooltipOpen(true);
        setInfoText("Что-то пошло не так! Попробуйте ещё раз.");
      } finally {
        setIsCardsLoading(false);
      }
    },
    [navigate]
  );

  const handleLogout = useCallback(() => {
    setLoggedIn(false);
    setEmail("");
    localStorage.removeItem("jwt");
    navigate("/sign-in", { replace: true });
  }, [navigate]);

  return (
    <div className="App">
      <div className="page">
        <CurrentUserContext.Provider value={currentUser}>
          <Header email={email} onExit={handleLogout} loggedIn={loggedIn} />
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute
                  loggedIn={loggedIn}
                  element={Main}
                  cards={cards}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                />
              }
            />
            <Route
              path="/sign-up"
              element={<Register handleRegister={handleRegistration} />}
            />
            <Route path="/sign-in" element={<Login onLogin={handleLogin} />} />
            <Route
              path="*"
              element={
                loggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" />
              }
            />
          </Routes>
          <Footer />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            onChanging={isEditProfileChanging}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
            onChanging={isAddPlaceChanging}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            onChanging={isEditAvatarChanging}
          />
          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
            isOpen={isImagePopupOpen}
          />
          <Spinner isLoading={isCardsLoading} />
          <InfoTooltip
            onClose={closeAllPopups}
            isOpen={isInfoTooltipOpen}
            title={infoText}
            image={infoTooltipStatus ? success : fail}
          />
        </CurrentUserContext.Provider>
      </div>
    </div>
  );
}

export default App;
