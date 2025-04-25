const { expect } = require("chai");
const { render, screen, waitFor } = require("@testing-library/react");
const App = require("../src/App").default;

// Add toBeInTheDocument to Chai
const toBeInTheDocument = function () {
  const { actual } = this;
  const pass = actual && actual.isConnected;
  this.assert(
    pass,
    "expected element to be in the document",
    "expected element not to be in the document",
    actual
  );
};
require("chai").use((chai) => {
  chai.Assertion.addMethod("toBeInTheDocument", toBeInTheDocument);
});

// Mock data
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

// Mock fetch
beforeEach(() => {
  global.fetch = () =>
    Promise.resolve({
      ok: true,
      status: 200,
      headers: {
        get: (header) => (header === "content-type" ? "application/json" : null),
      },
      json: () => Promise.resolve(mockPlants),
    });
});

afterEach(() => {
  global.fetch = undefined;
});

describe("App", () => {
  it("renders Plantsy header", () => {
    render(<App />);
    const headerElement = screen.getByText(/plantsy/i);
    expect(headerElement).toBeInTheDocument();
  });

  it("renders search bar", () => {
    render(<App />);
    const searchLabel = screen.getByLabelText(/search plants/i);
    expect(searchLabel).toBeInTheDocument();
    const searchInput = screen.getByPlaceholderText(/type a name to search/i);
    expect(searchInput).toBeInTheDocument();
  });

  it("renders new plant form", () => {
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

  it("fetches and renders plants", async () => {
    render(<App />);

    expect(global.fetch).toHaveBeenCalledWith("https://plantsy-jsonserver.vercel.app/plants");

    await waitFor(() => {
      expect(screen.getByText(/aloe/i)).toBeInTheDocument();
      expect(screen.getByText(/zz plant/i)).toBeInTheDocument();
    }, { timeout: 2000 });

    expect(screen.getByText(/price: \$15.99/i)).toBeInTheDocument();
    expect(screen.getByText(/price: \$25.98/i)).toBeInTheDocument();
    expect(screen.getAllByText(/in stock/i)).to.have.lengthOf(2);
  });
});