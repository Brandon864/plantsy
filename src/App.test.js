import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

// Mock the fetch API before each test
beforeEach(() => {
  fetch.resetMocks();
});

test("renders Plantsy header", () => {
  render(<App />);
  const headerElement = screen.getByText(/plantsy/i);
  expect(headerElement).toBeInTheDocument();
});

test("renders search bar", () => {
  render(<App />);
  const searchLabel = screen.getByLabelText(/search plants/i);
  expect(searchLabel).toBeInTheDocument();
  const searchInput = screen.getByPlaceholderText(/type a name to search/i);
  expect(searchInput).toBeInTheDocument();
});

test("renders new plant form", () => {
  render(<App />);
  const formHeader = screen.getByText(/new plant/i);
  expect(formHeader).toBeInTheDocument();
  const nameInput = screen.getByPlaceholderText(/plant name/i);
  expect(nameInput).toBeInTheDocument();
  const imageInput = screen.getByPlaceholderText(/image url/i);
  expect(imageInput).toBeInTheDocument();
  const priceInput = screen.getByPlaceholderText(/price/i);
  expect(priceInput).toBeInTheDocument();
  const addButton = screen.getByText(/add plant/i);
  expect(addButton).toBeInTheDocument();
});

test("fetches and renders plants", async () => {
  const mockPlants = [
    {
      id: 1,
      name: "Aloe",
      image: "https://images.unsplash.com/photo-1599819177738-4a13b509992d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      price: 15.99,
    },
    {
      id: 2,
      name: "ZZ Plant",
      image: "https://images.unsplash.com/photo-1614594975525-963e6e2b92a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      price: 25.98,
    },
  ];

  // Mock the fetch response
  fetch.mockResponseOnce(JSON.stringify(mockPlants), {
    status: 200,
    headers: { "content-type": "application/json" },
  });

  render(<App />);

  // Verify the fetch call was made with the correct URL
  expect(fetch).toHaveBeenCalledWith("https://plantsy-jsonserver.vercel.app/plants");

  // Wait for the plants to be fetched and rendered
  await waitFor(() => {
    expect(screen.getByText(/aloe/i)).toBeInTheDocument();
    expect(screen.getByText(/zz plant/i)).toBeInTheDocument();
  }, { timeout: 2000 });

  // Check for plant details
  expect(screen.getByText(/price: \$15.99/i)).toBeInTheDocument();
  expect(screen.getByText(/price: \$25.98/i)).toBeInTheDocument();
  expect(screen.getAllByText(/in stock/i)).toHaveLength(2); // Both plants start "In Stock"
});