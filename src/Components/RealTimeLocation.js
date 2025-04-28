


import { useEffect, useState } from "react";

const RealTimeLocation = () => {
  const [realTimeLocation, setRealTimeLocation] = useState({ lat: null, lon: null });
  const [realTimeAddress, setRealTimeAddress] = useState("");
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
          setRealTimeAddress(data.display_name);
        } else {
          setRealTimeAddress("Address not found");
        }
      } catch (err) {
        console.error("Error fetching realTimeAddress:", err);
        setRealTimeAddress("Error fetching realTimeAddress");
      }
    };

    const successCallback = (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      setRealTimeLocation({ lat, lon });
      console.log("Location:", lat, lon);

      fetchAddress(lat, lon); // Get realTimeAddress
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
          Latitude: {realTimeLocation.lat} <br />
          Longitude: {realTimeLocation.lon} <br />
          Address: {realTimeAddress}
        </p>
      )}
    </div>
  );
};

export default RealTimeLocation;

