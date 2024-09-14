import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./Cart.css";
import close from '../../assets/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.png';
import cart_arrow from '../../assets/cart-arrow.png';
import map from '../../assets/map.png';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const wilayas = [
    { name: "1- Adrar", home: 1400, bureau: 970 },
    { name: "2- Chlef", home: 850, bureau: 520 },
    { name: "3- Laghouat", home: 950, bureau: 620 },
    { name: "4- Oum El Bouaghi", home: 850, bureau: 520 },
    { name: "5- Batna", home: 900, bureau: 520 },
    { name: "6- Béjaïa", home: 800, bureau: 520 },
    { name: "7- Biskra", home: 950, bureau: 620 },
    { name: "8- Béchar", home: 1100, bureau: 720 },
    { name: "9- Blida", home: 600, bureau: 470},
    { name: "10- Bouira", home: 700, bureau: 520 },
    { name: "11- Tamanrasset", home: 1600, bureau: 1120 },
    { name: "12- Tébessa", home: 900, bureau: 570 },
    { name: "13- Tlemcen", home: 900, bureau: 570 },
    { name: "14- Tiaret", home: 850, bureau: 520 },
    { name: "15- Tizi Ouzou", home: 750, bureau: 520 },
    { name: "16- Alger", home: 500, bureau: 370 },
    { name: "17- Djelfa", home: 950, bureau: 570 },
    { name: "18- Jijel", home: 900, bureau: 520 },
    { name: "19- Sétif", home: 800, bureau: 520 },
    { name: "20- Saïda", home: 900, bureau: 570 },
    { name: "21- Skikda", home: 900, bureau: 520 },
    { name: "22- Sidi Bel Abbès", home: 900, bureau: 520 },
    { name: "23- Annaba", home: 850, bureau: 520 },
    { name: "24- Guelma", home: 900, bureau: 520 },
    { name: "25- Constantine", home: 800, bureau: 520 },
    { name: "26- Médéa", home: 800, bureau: 520 },
    { name: "27- Mostaganem", home: 900, bureau: 520 },
    { name: "28- M'Sila", home: 850, bureau: 570 },
    { name: "29- Mascara", home: 900, bureau: 520 },
    { name: "30- Ouargla", home: 950, bureau: 670 },
    { name: "31- Oran", home: 800, bureau: 520 },
    { name: "32- El Bayadh", home: 1100, bureau: 670 },
    { name: "34- Bordj Bou Arréridj", home: 800, bureau: 520 },
    { name: "35- Boumerdès", home: 700, bureau: 520 },
    { name: "36- El Tarf", home: 850, bureau: 520 },
    { name: "38- Tissemsilt", home: 900, bureau: null },
    { name: "39- El Oued", home: 950, bureau: 670 },
    { name: "40- Khenchela", home: 900, bureau: null },
    { name: "41- Souk Ahras", home: 900, bureau: 520 },
    { name: "42- Tipaza", home: 700, bureau: 520 },
    { name: "43- Mila", home: 900, bureau: 520 },
    { name: "44- Aïn Defla", home: 900, bureau: 520 },
    { name: "45- Naâma", home: 1100, bureau: 670 },
    { name: "46- Aïn Témouchent", home: 900, bureau: 520 },
    { name: "47- Ghardaïa", home: 950, bureau: 620 },
    { name: "48- Relizane", home: 900, bureau: 520 },
    { name: "49- Timimoun", home: 1400, bureau: null },
    { name: "51- Ouled Djellal", home: 950, bureau: 620 },
    { name: "52- Béni Abbès", home: 1100, bureau: 970 },
    { name: "53- In Salah", home: 1600, bureau: null },
    { name: "54- In Guezzam", home: 1600, bureau: null },
    { name: "55- Touggourt", home: 950, bureau: 670 },
    { name: "57- El M'Ghair", home: 950, bureau: null },
    { name: "58- El Meniaa", home: 1000, bureau: null }
];


const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const { t } = useTranslation();
    const [messageSent, setMessageSent] = useState(false);
    const [NotValid, setNotValid] = useState(false);
    const [isCartEmpty, setIsCartEmpty] = useState(false);
    const [notValidTimeout, setNotValidTimeout] = useState(null);
    const [subtotal, setSubtotal] = useState(0);
    const [shippingCost, setShippingCost] = useState(0);
    const [clientInfo, setClientInfo] = useState({
        nom: '',
        prenom: '',
        phone: '',
        deliveryMethod: 'office',
        wilaya: '',
        commune: '',
        adresse: ''
    });
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem("cartItems")) || [];
        setCartItems(items);
    }, []);

    useEffect(() => {
        const selectedWilaya = wilayas.find(w => w.name === clientInfo.wilaya);
        if (selectedWilaya) {
            const cost = clientInfo.deliveryMethod === 'home' ? selectedWilaya.home : selectedWilaya.bureau;
            setShippingCost(cost !== null ? cost : 0);
        } else {
            setShippingCost(0);
        }
    }, [clientInfo.wilaya, clientInfo.deliveryMethod]);

    useEffect(() => {
        const itemsTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        setSubtotal(itemsTotal);
    }, [cartItems]);

    useEffect(() => {
        validateForm();
    }, [clientInfo, cartItems]);

    useEffect(() => {
        // Clear the timeout if the component unmounts
        return () => {
            if (window.clearTimeout) {
                window.clearTimeout(notValidTimeout);
            }
        };
    }, []);

    const handleBack = () => {
        navigate(-1);
    };
    const getDeliveryOptions = (wilaya) => {
        const options = [<option key="office" value="office">{t('cart.DeliveryToZR')}</option>];
        if (wilaya && wilaya.home !== null) {
            options.push(<option key="home" value="home">{t('cart.DeliveryToHome')}</option>);
        }
        return options;
    };

    const removeFromCart = (index) => {
        const updatedCartItems = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCartItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    };

    const adjustQuantity = (index, delta) => {
        const updatedCartItems = [...cartItems];
        const newQuantity = updatedCartItems[index].quantity + delta;
        if (newQuantity > 0) {
            updatedCartItems[index].quantity = newQuantity;
            setCartItems(updatedCartItems);
            localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        }
    };

    const handleLanguageChange = (index, language) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems[index].selectedLanguage = language;
        setCartItems(updatedCartItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClientInfo(prevInfo => ({ ...prevInfo, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!clientInfo.nom) newErrors.nom = "Family Name is required";
        if (!clientInfo.prenom) newErrors.prenom = "First Name is required";
        if (!clientInfo.phone) newErrors.phone = "Phone Number is required";
        if (!clientInfo.wilaya) newErrors.wilaya = "Wilaya is required";
        if (clientInfo.deliveryMethod === 'home' && !clientInfo.adresse) newErrors.adresse = "Address is required";

        cartItems.forEach((item, index) => {
            if (!item.selectedLanguage) {
                newErrors[`language-${index}`] = `Language is required for ${item.title}`;
            }
        });

        setErrors(newErrors);
        setIsFormValid(Object.keys(newErrors).length === 0);
    };

    const handleBuy = async () => {
        if (cartItems.length === 0) {
            setIsCartEmpty(true);
            setTimeout(() => setIsCartEmpty(false), 2000); // Hide the message after 2 seconds
            return;
        }
        if (!isFormValid) {
            setNotValid(true);
            const notValidTimeout = setTimeout(() => setNotValid(false), 2000);
            validateForm();
            return;
        }
    
        try {
            const response = await axios.post('https://bookoub-server.onrender.com/api/send-email', {
                cartItems,
                clientInfo,
                subtotal,
                shippingCost,
                total: calculateTotal(),
            });
            // Handle response (e.g., order placed successfully)
            console.log('Order placed successfully:', response.data);
    
            // Clear cart items and local storage
            setCartItems([]);
            localStorage.removeItem("cartItems");
    
            // Reset form fields
            setClientInfo({
                nom: '',
                prenom: '',
                phone: '',
                deliveryMethod: 'home',
                wilaya: '',
                commune: '',
                adresse: ''
            });
    
            setMessageSent(true);
            setNotValid(false);
            setTimeout(() => setMessageSent(false), 2000); // Hide the success message after 2 seconds
        } catch (error) {
            console.error('Error placing order:', error);
            alert('There was an error placing the order. Please try again.');
        }
    };
    
    const calculateTotal = () => {
        return subtotal + shippingCost;
    };

    return (
        <div className="cartpage">
            <div className="cart-items">
                <div className="cart-title-container">
                    <h3 className="cart-title">{t('cart.List')}</h3>
                    <h5>{cartItems.length} {t('cart.items')}</h5>
                </div>

                {cartItems.length > 0 ? (
                    cartItems.map((item, index) => (
                        <div key={index} className="cart-item">
                            <img className="cart-item-image" src={item.image} alt={item.title} />
                            <div className="cart-item-details">
                                <div className="cart-title-button">
                                    <p className="cart-item-title">{item.title}</p>
                                    <img className="cart-item-remove" onClick={() => removeFromCart(index)} src={close} alt="Remove" />
                                </div>

                            <div className="quantity-price">
                                <div className="quantity">
                                    <button className="cart-quantity-btn minus" onClick={() => adjustQuantity(index, -1)}>-</button>
                                    <span className="cart-quantity-display">{item.quantity}</span>
                                    <button className="cart-quantity-btn plus" onClick={() => adjustQuantity(index, 1)}>+</button>
                                </div>
                                <div className="cart-item-languages">
                                    {item.languages.map((language, langIndex) => (
                                        <div key={langIndex} className="checkbox-container">
                                            <input
                                                type="radio"
                                                id={`${language}-${index}-${langIndex}`}
                                                name={`${language}-${index}`}
                    value={language}
                    checked={item.selectedLanguage === language}
                    onChange={() => handleLanguageChange(index, language)}
                />
                <label htmlFor={`${language}-${index}-${langIndex}`}>
                    {language}
                </label>
            </div>
        ))}
    </div>
    <p className="cart-item-price">{item.price} Da</p>
    </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="empty-cart">{t('cart.Yourcartisempty')}</p>
                )}

                <button className="btn-back-to-shop" onClick={handleBack}>
                    <img src={cart_arrow} alt="Back to Shop" /> {t('cart.BacktoShop')}
                </button>
            </div>

            <div className="info-summary-container">
                <div className="cart-footer">
                    <h4 className="Order-summary">{t('cart.OrderSummary')}</h4>
                    <h5>{t('cart.Shipping')}:<span>{shippingCost} Da</span></h5>
                    <h5 className="subtotale">{t('cart.Subtotal')}:<span>{subtotal} Da</span></h5>
                    <h5 className="totale">{t('cart.Total')}: <span>{calculateTotal()} Da</span></h5>
                </div>
                <div className="client-delivery-info">
                    <h4>{t('cart.DeliveryInformation')}</h4>
                    <form className="info-inputs">
                        <input
                            required
                            type="text"
                            placeholder={t('cart.FamilyName')}
                            name="nom"
                            value={clientInfo.nom}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                        <input
                            required
                            type="text"
                            placeholder={t('cart.FirstName')}
                            name="prenom"
                            value={clientInfo.prenom}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                        <input
                            required
                            type="text"
                            placeholder={t('cart.PhoneNumber')}
                            name="phone"
                            value={clientInfo.phone}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                         <select
                        name="deliveryMethod"
                        value={clientInfo.deliveryMethod}
                        onChange={handleInputChange}
                        className="input-field"
                    >
                        <option value="office">{t('cart.DeliveryToZR')}</option>
                        {clientInfo.wilaya && wilayas.find(w => w.name === clientInfo.wilaya)?.home !== null && (
                            <option value="home">{t('cart.DeliveryToHome')}</option>
                        )}
                    </select>
      
                        <select
                            name="wilaya"
                            value={clientInfo.wilaya}
                            onChange={handleInputChange}
                            className="input-field"
                        >
                            <option value="">{t('cart.Wilaya')}</option>
                            {wilayas.map(wilaya => (
                                <option key={wilaya.name} value={wilaya.name}>{wilaya.name}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder={t('cart.City')}
                            name="commune"
                            value={clientInfo.commune}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                 
                        
                        {clientInfo.deliveryMethod === 'home' && (
                             <div className="address-container">
                             <input
                                 required
                                 type="text"
                                 placeholder="Address"
                                 name="adresse"
                                 value={clientInfo.adresse}
                                 onChange={handleInputChange}
                                 className="input-field"
                             />
                             <button  className="map-button">
                                 <img src={map} alt="Open Map" />
                             </button>
                         </div>
                        )}
                    </form>
                    <button className="checkout-button" onClick={handleBuy}>{t('cart.BUY')}</button>
                    {messageSent && <p className="swap">{t('cart.SENTSUCCESSFULLY!!')}</p>}
                    {NotValid && <p className="swap">{t('cart.Enterallinfos')}</p>}
                    {isCartEmpty && <p className="swap">{t('cart.Yourcartisempty')}</p>}
                </div>
            </div>
        </div>
    );
};

export default Cart;