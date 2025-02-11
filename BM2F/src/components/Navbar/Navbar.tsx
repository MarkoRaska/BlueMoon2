import { FaBars } from "react-icons/fa";

const Navbar = ({ onIconClick }: { onIconClick: () => void }) => {
  return (
    <div
      style={{
        backgroundColor: "lightblue",
        height: "70px",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        userSelect: "none",
      }}
    >
      <FaBars
        size={35}
        style={{ marginRight: "20px", cursor: "pointer" }}
        onClick={onIconClick}
      />
      <h1>Navbar</h1>
    </div>
  );
};

export default Navbar;
