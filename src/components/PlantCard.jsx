import { useState } from "react";

function PlantCard({ plant, plants, setPlants }) {
  const [newPrice, setNewPrice] = useState(plant.price);
  const [isEditing, setIsEditing] = useState(false);

  const toggleSoldOut = () => {
    setPlants(
      plants.map((p) =>
        p.id === plant.id ? { ...p, soldOut: !p.soldOut } : p
      )
    );
  };

  const updatePrice = () => {
    fetch(`http://localhost:6001/plants/${plant.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ price: parseFloat(newPrice) }),
    })
      .then((response) => response.json())
      .then((updatedPlant) => {
        setPlants(
          plants.map((p) => (p.id === plant.id ? updatedPlant : p))
        );
        setIsEditing(false);
      });
  };

  const deletePlant = () => {
    fetch(`http://localhost:6001/plants/${plant.id}`, {
      method: "DELETE",
    }).then(() => {
      setPlants(plants.filter((p) => p.id !== plant.id));
    });
  };

  return (
    <li className="card">
      <img src={plant.image} alt={plant.name} />
      <h4>{plant.name}</h4>
      {isEditing ? (
        <div>
          <input
            type="number"
            step="0.01"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />
          <button onClick={updatePrice}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <p>Price: ${plant.price.toFixed(2)}</p>
      )}
      <button onClick={toggleSoldOut}>
        {plant.soldOut ? "Sold Out" : "In Stock"}
      </button>
      <button onClick={() => setIsEditing(true)}>Edit Price</button>
      <button onClick={deletePlant}>Delete</button>
    </li>
  );
}

export default PlantCard;