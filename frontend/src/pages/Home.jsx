import { useState, useEffect } from "react";
import api from "../api";

function Home() {
  const [assignedSubmissions, setAssignedSubmissions] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    console.log("Fetching assigned submissions and profile");
    getAssignedSubmissions();
    getProfile();
  }, []);

  const getAssignedSubmissions = async () => {
    try {
      const timerLabel = "Fetching assigned submissions";
      console.time(timerLabel);
      const networkStartTime = performance.now();
      const res = await api.get("/api/readers/assigned_submissions/");
      const networkEndTime = performance.now();
      console.log(
        `Network request time: ${networkEndTime - networkStartTime} ms`
      );

      const dataProcessingStartTime = performance.now();
      const data = res.data;
      console.log("Assigned submissions data:", data);
      const dataProcessingEndTime = performance.now();
      console.log(
        `Data processing time: ${
          dataProcessingEndTime - dataProcessingStartTime
        } ms`
      );

      const stateUpdateStartTime = performance.now();
      setAssignedSubmissions(data);
      const stateUpdateEndTime = performance.now();
      console.log(
        `State update time: ${stateUpdateEndTime - stateUpdateStartTime} ms`
      );

      console.timeEnd(timerLabel);
    } catch (error) {
      console.error("Error fetching assigned submissions:", error);
      alert("Error fetching assigned submissions. Please try again later.");
    }
  };

  const getProfile = async () => {
    try {
      const timerLabel = "Fetching profile";
      console.time(timerLabel);
      const res = await api.get("/api/profiles/me/");
      const data = res.data;
      console.log("Profile data:", data);
      setProfile(data);
      console.timeEnd(timerLabel);
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Error fetching profile. Please try again later.");
    }
  };

  console.time("Rendering Home component");
  const renderedComponent = (
    <div>
      <div>
        <h2>Assigned Submissions</h2>
        <ul>
          {assignedSubmissions.map((submission) => (
            <li key={submission.id}>
              {submission.student.first_name} {submission.student.last_name} -{" "}
              {submission.cycle.season} {submission.cycle.year} -{" "}
              {submission.credit.number} {submission.credit.name} -{" "}
              {submission.rationale}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  console.timeEnd("Rendering Home component");
  return renderedComponent;
}

export default Home;
