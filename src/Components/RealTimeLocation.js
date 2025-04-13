


import { useEffect, useState } from "react";

const RealTimeLocation = () => {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    let watchId;

    const fetchAddress = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        console.log(data);
        
        if (data.display_name) {
          setAddress(data.display_name);
        } else {
          setAddress("Address not found");
        }
      } catch (err) {
        console.error("Error fetching address:", err);
        setAddress("Error fetching address");
      }
    };

    const successCallback = (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      setLocation({ lat, lon });
      console.log("Location:", lat, lon);

      fetchAddress(lat, lon); // Get address
    };

    const errorCallback = (err) => {
      setError(err.message);
    };

    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, {
        enableHighAccuracy: true,
        maximumAge: 0,
      });
    } else {
      setError("Geolocation is not supported by this browser.");
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <p>
          Latitude: {location.lat} <br />
          Longitude: {location.lon} <br />
          Address: {address}
        </p>
      )}
    </div>
  );
};

export default RealTimeLocation;

