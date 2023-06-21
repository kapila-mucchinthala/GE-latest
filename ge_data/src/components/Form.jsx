import React from "react";
import Styles from "./form.module.css";
import axios from 'axios';
import { useState } from "react";

export const Form = () => {
  const [formData, setFormData] = useState({
    project_name: "",
    project_description: "",
    total_tables: "",
    total_files: "",
    owners: [
      { owner_name: "", owner_designation: "" },
      { owner_name: "", owner_designation: "" },
      { owner_name: "", owner_designation: "" },
    ],
  });

  const [projectDetails, setProjectDetails] = useState(null); // State to hold the fetched project details

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if it's an owner field
    if (name.startsWith("owner_name") || name.startsWith("owner_designation")) {
      const fieldIndex = parseInt(name.slice(-1)) - 1;

      setFormData((prevData) => {
        const owners = prevData.owners.map((owner, index) => {
          if (index === fieldIndex) {
            return {
              ...owner,
              [name.includes("owner_name") ? "owner_name" : "owner_designation"]: value,
            };
          }
          return owner;
        });
        return { ...prevData, owners };
      });
    } else if (name === "total_tables" || name === "total_files") {
      // Only allow numbers for "Total Tables" and "Total Files"
      const sanitizedValue = value.replace(/[^0-9]/g, "");
      setFormData((prevData) => ({ ...prevData, [name]: sanitizedValue }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filter the owners array to include only non-empty owners
    const updatedOwners = formData.owners.filter(
      (owner) => owner.owner_name.trim() !== "" && owner.owner_designation.trim() !== ""
    );

    // Create a new details object
    const info = {
      project_name: formData.project_name,
      project_description: formData.project_description,
      total_tables: formData.total_tables,
      total_files: formData.total_files,
      owners: updatedOwners,
    };
     console.log("info:", info);
    // Validate the form
    if (!validateForm()) {
      return;
    }
  
    try {
      // await axios.post("http://localhost:3990/data", info);
      await axios.post("http://internal-bu-dna-dra-docstar-alb-1252189529.us-east-1.elb.amazonaws.com/postgres/projects/", info);

      // Clear the form input fields
      setFormData({
        project_name: "",
        project_description: "",
        total_tables: "",
        total_files: "",
        owners: [
          { owner_name: "", owner_designation: "" },
          { owner_name: "", owner_designation: "" },
          { owner_name: "", owner_designation: "" },
        ],
      });
      alert("Project details saved successfully");

      // Clear the individual input fields
      const inputFields = document.querySelectorAll('input[type="text"], input[type="number"]');
      inputFields.forEach((input) => (input.value = ""));
    } catch (error) {
      console.error("Error saving project details:", error);
    }
  };

  const validateForm = () => {
    setProjectDetails("");
  
    // Check if any number fields are not filled or are not valid numbers
    if (
      (formData.total_tables.trim() === "" || isNaN(formData.total_tables)) ||
      (formData.total_files.trim() === "" || isNaN(formData.total_files))
    ) {
      alert("Please fill the number fields with valid numbers");
      return false;
    }
  
    // Check if any other fields are not filled
    if (
      formData.project_name.trim() === "" ||
      formData.project_description.trim() === "" ||
      formData.total_tables.trim() === "" ||
      formData.total_files.trim() === "" ||
      formData.owners.some((owner) => owner.owner_name.trim() === "" || owner.owner_designation.trim() === "")
    ) {
      alert("Please fill all the fields");
      return false;
    }
  
    return true;
  };
  
  const fetchProjectDetails = async () => {
    console.log("Fetching project details...");

    try {
      const id = 2;
      // const response = await axios.get(`http://localhost:3990/data/${id}`);
      const response = await axios.get(`http://internal-bu-dna-dra-docstar-alb-1252189529.us-east-1.elb.amazonaws.com/postgres/projects/`);
      console.log("Response:", response.data);
      const projectDetails = response.data;
      console.log("Project details:", projectDetails);
      // Update the form data with the retrieved details
      setProjectDetails(projectDetails);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  return (
    <div>
      <div>
        <form className={Styles.formLayout}>
          <div className={Styles.formDiv}>
            <div className={Styles.formLabel}>
              <label>Project Name</label>
            </div>
            <div>
              <input type="text" name="project_name" onChange={handleChange} />
            </div>
          </div>
          <div className={Styles.formDiv}>
            <div className={Styles.formLabel}>
              <label>Project Description</label>
            </div>
            <div>
              <input type="text" name="project_description" onChange={handleChange} />
            </div>
          </div>
          <div className={Styles.formDiv}>
            <div className={Styles.formLabel}>
              <label>Total Tables</label>
            </div>
            <div>
              <input type="text" name="total_tables" onChange={handleChange} />
            </div>
          </div>
          <div className={Styles.formDiv}>
            <div className={Styles.formLabel}>
              <label>Total Files</label>
            </div>
            <div>
              <input type="text" name="total_files" onChange={handleChange} />
            </div>
          </div>
          <div className={Styles.formDiv}>
            <div className={Styles.formLabel}>
              <label>Owner Name</label>
            </div>
            <div className={Styles.formInput}>
              <input type="text" name="owner_name_1" onChange={handleChange} />
              <input type="text" name="owner_name_2" onChange={handleChange} />
              <input type="text" name="owner_name_3" onChange={handleChange} />
            </div>
          </div>
          <div className={Styles.formDiv}>
            <div className={Styles.formLabel}>
              <label>Owner Designation</label>
            </div>
            <div className={Styles.formInput}>
              <input type="text" name="owner_designation_1" onChange={handleChange} />
              <input type="text" name="owner_designation_2" onChange={handleChange} />
              <input type="text" name="owner_designation_3" onChange={handleChange} />
            </div>
          </div>
          <div className={Styles.formButtons}>
            <button>New</button>
            <button onClick={handleSubmit} type="submit">Save</button>
            <button onClick={fetchProjectDetails} type="button">Pull</button>
          </div>
        </form>

        <div>
          {/* Display the fetched project details */}
          {projectDetails && (
            <div className={Styles.projectDetails}>
              <h2>Project Details</h2>
              <p>Project Name: {projectDetails.project_name}</p>
              <p>Project Description: {projectDetails.project_description}</p>
              <p>Total Tables: {projectDetails.total_tables}</p>
              <p>Total Files: {projectDetails.total_files}</p>

              <h3>Owners:</h3>
              {projectDetails.owners.map((owner, index) => (
                <div key={index}>
                  <p>Name: {owner.owner_name}</p>
                  <p>Designation: {owner.owner_designation}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



