import { FaBars, FaCog, FaUser } from "react-icons/fa";

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
        position: "relative", // Add relative positioning to the navbar
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <FaBars
          size={35}
          style={{ marginRight: "20px", cursor: "pointer" }}
          onClick={onIconClick}
        />
        <button
          onClick={() => (window.location.href = "/logout")}
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "20px", // Increased font size
            fontWeight: "bold", // Bold text
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "max-content",
          }}
        >
          <button
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "20px", // Increased font size
              fontWeight: "bold", // Bold text
              cursor: "pointer",
              marginRight: "40px", // Increased margin for spacing
              width: "150px", // Fixed width for consistency
            }}
          >
            Credits to Read
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "20px",
              fontWeight: "bold",
              cursor: "pointer",
              marginLeft: "40px", // Increased margin for spacing
              width: "150px", // Fixed width for consistency
            }}
          >
            Reconciliation
          </button>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <FaUser size={30} style={{ marginRight: "20px", cursor: "pointer" }} />
        <FaCog size={30} style={{ cursor: "pointer" }} />
      </div>
    </div>
  );
};

export default Navbar;
