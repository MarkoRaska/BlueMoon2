import { FaBars, FaCog, FaUser } from "react-icons/fa";
import { Button } from "antd";

const Navbar = ({ onIconClick }: { onIconClick: () => void }) => {
  return (
    <div
      style={{
        background: "linear-gradient(to right, #0091ff, #00ccff)", // Gradient blue
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // Add space between elements
        padding: "0 20px",
        userSelect: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <FaBars
          size={35}
          style={{ marginRight: "20px", cursor: "pointer" }}
          onClick={onIconClick}
        />
        <Button
          type="primary"
          onClick={() => (window.location.href = "/logout")}
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Logout
        </Button>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <FaUser size={30} style={{ marginRight: "20px", cursor: "pointer" }} />
        <FaCog size={30} style={{ cursor: "pointer" }} />
      </div>
    </div>
  );
};

export default Navbar;
