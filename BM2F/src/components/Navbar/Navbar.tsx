import { FaBars } from "react-icons/fa"; // Import the Pancake Stack icon

const Navbar = ({ onIconClick }: { onIconClick: () => void }) => {
  return (
    <div
      style={{
        backgroundColor: "lightblue",
        height: "70px",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        userSelect: "none", // Prevent text selection
      }}
    >
      <FaBars
        size={35}
        style={{ marginRight: "20px", cursor: "pointer" }} // Change cursor to pointer on hover
        onClick={onIconClick}
      />{" "}
      <h1>Navbar</h1>
    </div>
  );
};

export default Navbar;
