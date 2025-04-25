import { useState, useEffect } from "react";
import PlantList from "./components/PlantList";
import NewPlantForm from "./components/NewPlantForm";
import PlantSearch from "./components/PlantSearch";
import "./App.css"; // Optional, if provided

function App() {
  const [plants, setPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch plants on mount
  useEffect(() => {
    fetch("https://plantsy-jsonserver.vercel.app/plants")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setPlants(data))
      .catch((error) => {
        console.error("Fetch error:", error);
        setPlants([]); // Fallback to empty array
      });
  }, []);

  // Add a new plant
  const addPlant = (newPlant) => {
    fetch("https://plantsy-jsonserver.vercel.app/plants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPlant),
    })
      .then((response) => response.json())
      .then((data) => setPlants([...plants, data]))
      .catch((error) => console.error("Error adding plant:", error));
  };

  // Filter plants by search term
  const filteredPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <h1>Plantsy</h1>
      <PlantSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <NewPlantForm addPlant={addPlant} />
      <PlantList plants={filteredPlants} setPlants={setPlants} />
    </div>
  );
}

export default App;