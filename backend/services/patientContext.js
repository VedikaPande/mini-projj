const Patient = require('../models/Patient');

class PatientContextService {
  /**
   * Fetch patient data by ID and format it for LLM context
   * @param {string} patientId - The patient's ID
   * @returns {Promise<string>} - Formatted patient context
   */
  async getPatientContext(patientId) {
    try {
      if (!patientId) {
        return '';
      }

      const patient = await Patient.findById(patientId);
      
      if (!patient) {
        console.log(`Patient with ID ${patientId} not found`);
        return '';
      }

      return this.formatPatientContext(patient);
    } catch (error) {
      console.error('Error fetching patient context:', error.message);
      return '';
    }
  }

  /**
   * Format patient data into a readable context for the LLM
   * @param {Object} patient - Patient data from database
   * @returns {string} - Formatted context string
   */
  formatPatientContext(patient) {
    const context = `
PATIENT MEDICAL HISTORY:
- Patient Name: ${patient.patient_name}
- Age: ${patient.age} years old
- Gender: ${patient.gender}
- Primary Diagnosis: ${patient.diagnosis}
- Severity Level: ${patient.severity_level}

TREATMENT HISTORY:
- Admission Date: ${patient.admission_date}
- Discharge Date: ${patient.discharge_date}
- Treatment Type: ${patient.treatment_type}
- Current/Previous Medication: ${patient.medication}
- Number of Sessions Completed: ${patient.session_count}
- Treatment Outcome: ${patient.outcome}

CLINICAL NOTES:
- Doctor's Description: ${patient.doctor_description}
- Doctor's Statement: ${patient.doctor_statement}

IMPORTANT: Use this information to provide personalized support while maintaining patient confidentiality. Reference their treatment history appropriately and consider their specific diagnosis and previous outcomes when providing guidance.
    `.trim();

    return context;
  }

  /**
   * Get a summary of patient's mental health status
   * @param {string} patientId - The patient's ID
   * @returns {Promise<Object>} - Patient summary object
   */
  async getPatientSummary(patientId) {
    try {
      const patient = await Patient.findById(patientId);
      
      if (!patient) {
        return null;
      }

      return {
        patientId: patient._id,
        name: patient.patient_name,
        age: patient.age,
        gender: patient.gender,
        primaryDiagnosis: patient.diagnosis,
        severityLevel: patient.severity_level,
        treatmentType: patient.treatment_type,
        sessionCount: patient.session_count,
        outcome: patient.outcome,
        isActive: patient.discharge_date === 'N/A' || patient.outcome === 'Ongoing'
      };
    } catch (error) {
      console.error('Error getting patient summary:', error.message);
      return null;
    }
  }

  /**
   * Search patients by name (for admin/clinical use)
   * @param {string} searchTerm - Search term for patient name
   * @param {number} limit - Maximum number of results
   * @returns {Promise<Array>} - Array of matching patients
   */
  async searchPatients(searchTerm, limit = 10) {
    try {
      const patients = await Patient.find({
        patient_name: { $regex: searchTerm, $options: 'i' }
      })
      .select('_id patient_name age gender diagnosis severity_level outcome')
      .limit(limit);

      return patients;
    } catch (error) {
      console.error('Error searching patients:', error.message);
      return [];
    }
  }

  /**
   * Get patients by diagnosis (for analytics)
   * @param {string} diagnosis - Mental health diagnosis
   * @returns {Promise<Array>} - Array of patients with the diagnosis
   */
  async getPatientsByDiagnosis(diagnosis) {
    try {
      const patients = await Patient.find({
        diagnosis: { $regex: diagnosis, $options: 'i' }
      })
      .select('_id patient_name age gender severity_level treatment_type outcome');

      return patients;
    } catch (error) {
      console.error('Error getting patients by diagnosis:', error.message);
      return [];
    }
  }

  /**
   * Validate if patient exists and is accessible
   * @param {string} patientId - The patient's ID
   * @returns {Promise<boolean>} - Whether patient exists and is accessible
   */
  async validatePatientAccess(patientId) {
    try {
      if (!patientId) {
        return false;
      }

      const patient = await Patient.findById(patientId).select('_id');
      return !!patient;
    } catch (error) {
      console.error('Error validating patient access:', error.message);
      return false;
    }
  }

  /**
   * Get anonymized patient context (removes identifying information)
   * @param {string} patientId - The patient's ID
   * @returns {Promise<string>} - Anonymized patient context
   */
  async getAnonymizedContext(patientId) {
    try {
      const patient = await Patient.findById(patientId);
      
      if (!patient) {
        return '';
      }

      const anonymizedContext = `
PATIENT PROFILE:
- Age: ${patient.age} years old
- Gender: ${patient.gender}
- Primary Diagnosis: ${patient.diagnosis}
- Severity Level: ${patient.severity_level}

TREATMENT INFORMATION:
- Treatment Type: ${patient.treatment_type}
- Sessions Completed: ${patient.session_count}
- Treatment Outcome: ${patient.outcome}

CLINICAL NOTES:
- Clinical Description: ${patient.doctor_description}
- Treatment Notes: ${patient.doctor_statement}

Note: This is anonymized patient information for clinical reference.
      `.trim();

      return anonymizedContext;
    } catch (error) {
      console.error('Error getting anonymized context:', error.message);
      return '';
    }
  }
}

module.exports = PatientContextService;