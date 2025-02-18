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
            fontSize: "20px",
            fontWeight: "600", // Semi-bold text
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
              fontSize: "23px", // Adjusted font size
              fontWeight: "600", // Semi-bold text
              cursor: "pointer",
              marginRight: "50px", // Increased margin for spacing
              width: "200px", // Adjusted width for consistency
              textAlign: "right", // Align text to the right
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#cbf1ff")}
            onMouseOut={(e) => (e.currentTarget.style.color = "white")}
          >
            Submissions
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "23px", // Adjusted font size
              fontWeight: "600", // Semi-bold text
              cursor: "pointer",
              marginLeft: "50px", // Increased margin for spacing
              marginRight: "50px", // Increased margin for spacing
              width: "200px", // Adjusted width for consistency
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#cbf1ff")}
            onMouseOut={(e) => (e.currentTarget.style.color = "white")}
          >
            Reconciliation
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "23px", // Adjusted font size
              fontWeight: "600", // Semi-bold text
              cursor: "pointer",
              marginLeft: "50px", // Increased margin for spacing
              width: "200px", // Adjusted width for consistency
              textAlign: "left", // Align text to the left
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#cbf1ff")}
            onMouseOut={(e) => (e.currentTarget.style.color = "white")}
          >
            Panels
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
