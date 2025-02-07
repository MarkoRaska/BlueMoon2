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
      console.time("Fetching assigned submissions");
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

      console.timeEnd("Fetching assigned submissions");
    } catch (error) {
      console.error("Error fetching assigned submissions:", error);
      alert(error);
    }
  };

  const getProfile = async () => {
    try {
      console.time("Fetching profile");
      const res = await api.get("/api/profiles/me/");
      const data = res.data;
      console.log("Profile data:", data);
      setProfile(data);
      console.timeEnd("Fetching profile");
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert(error);
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
              {submission.student.profile.first_name}{" "}
              {submission.student.profile.last_name} - {submission.cycle.season}{" "}
              {submission.cycle.year} - {submission.credit.number}{" "}
              {submission.credit.name} - {submission.rationale}
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
