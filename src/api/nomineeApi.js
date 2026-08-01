import axiosClient from "./axiosClient";

function tryAlternatePaths(
  primaryRequest,
  fallbackRequest,
) {
  return primaryRequest().catch((error) => {
    if (error.response?.status === 404) {
      return fallbackRequest();
    }

    return Promise.reject(error);
  });
}

export const nomineeApi = {
  /**
   * Create a new nominee.
   * POST /api/v1/nominees
   */
  createNominee(data) {
    return axiosClient.post("/nominees", data);
  },

  /**
   * Get all nominees.
   * GET /api/v1/nominees
   */
  getNominees(params = {}) {
    return axiosClient.get("/nominees", {
      params,
    });
  },

  /**
   * Get one nominee by ID.
   * GET /api/v1/nominees/{nomineeId}
   * Fallback: GET /api/v1/nominee/{nomineeId}
   */
  getNomineeById(nomineeId) {
    if (!nomineeId) {
      throw new Error("Nominee ID is required.");
    }

    return tryAlternatePaths(
      () =>
        axiosClient.get(
          `/nominees/${nomineeId}`,
        ),
      () =>
        axiosClient.get(
          `/nominee/${nomineeId}`,
        ),
    );
  },

  /**
   * Update nominee details.
   * PATCH /api/v1/nominees/{nomineeId}
   */
  updateNominee(nomineeId, data) {
    if (!nomineeId) {
      throw new Error("Nominee ID is required.");
    }

    return axiosClient.patch(
      `/nominees/${nomineeId}`,
      data,
    );
  },

  /**
   * Soft-delete a nominee.
   * DELETE /api/v1/nominees/{nomineeId}
   */
  deleteNominee(nomineeId) {
    if (!nomineeId) {
      throw new Error("Nominee ID is required.");
    }

    return axiosClient.delete(
      `/nominees/${nomineeId}`,
    );
  },

  /**
   * Mark nominee as primary.
   * PATCH /api/v1/nominees/{nomineeId}/primary
   */
  setPrimaryNominee(nomineeId) {
    if (!nomineeId) {
      throw new Error("Nominee ID is required.");
    }

    return axiosClient.patch(
      `/nominees/${nomineeId}/primary`,
    );
  },

  /**
   * Resend verification OTP.
   * POST /api/v1/nominees/{nomineeId}/resend-verification-otp
   */
  resendVerificationOtp(nomineeId) {
    if (!nomineeId) {
      throw new Error("Nominee ID is required.");
    }

    return axiosClient.post(
      `/nominees/${nomineeId}/resend-verification-otp`,
    );
  },

  /**
   * Verify nominee.
   *
   * Supports:
   * verifyNominee(id, "123456")
   * verifyNominee(id, { otp: "123456" })
   */
  verifyNominee(nomineeId, otpValue) {
    if (!nomineeId) {
      throw new Error("Nominee ID is required.");
    }

    const otp =
      typeof otpValue === "string"
        ? otpValue
        : otpValue?.otp;

    if (!otp) {
      throw new Error("OTP is required.");
    }

    return axiosClient.post(
      `/nominees/${nomineeId}/verify`,
      {
        otp: String(otp).trim(),
      }
    );
  },

  /**
   * Get assignable documents.
   * GET /api/v1/nominees/{nomineeId}/assignable-documents
   * Fallback: GET /api/v1/nominees/{nomineeId}/documents
   */
  getAssignableDocuments(nomineeId) {
    if (!nomineeId) {
      throw new Error("Nominee ID is required.");
    }

    return tryAlternatePaths(
      () =>
        axiosClient.get(
          `/nominees/${nomineeId}/assignable-documents`,
        ),
      () =>
        axiosClient.get(
          `/nominees/${nomineeId}/documents`,
        ),
    );
  },

  /**
   * Get assigned documents.
   * GET /api/v1/nominees/{nomineeId}/documents
   * Deprecated: prefer getAssignableDocuments.
   */
  getAssignedDocuments(nomineeId) {
    if (!nomineeId) {
      throw new Error("Nominee ID is required.");
    }

    return axiosClient.get(
      `/nominees/${nomineeId}/documents`,
    );
  },

  /**
   * Assign document.
   * POST /api/v1/nominees/{nomineeId}/documents/{documentId}
   */
  assignDocument(
    nomineeId,
    documentId,
    permissions,
  ) {
    if (!nomineeId || !documentId) {
      throw new Error(
        "Nominee ID and document ID are required."
      );
    }

    return axiosClient.post(
      `/nominees/${nomineeId}/documents/${documentId}`,
      permissions,
    );
  },

  /**
   * Update document permissions.
   * PATCH /api/v1/nominees/{nomineeId}/documents/{documentId}
   */
  updateDocumentAccess(
    nomineeId,
    documentId,
    permissions,
  ) {
    if (!nomineeId || !documentId) {
      throw new Error(
        "Nominee ID and document ID are required."
      );
    }

    return axiosClient.patch(
      `/nominees/${nomineeId}/documents/${documentId}`,
      permissions,
    );
  },

  /**
   * Get nominee permissions.
   * GET /api/v1/nominees/{nomineeId}/permissions
   */
  getNomineePermissions(nomineeId) {
    if (!nomineeId) {
      throw new Error("Nominee ID is required.");
    }

    return tryAlternatePaths(
      () =>
        axiosClient.get(
          `/nominees/${nomineeId}/permissions`,
        ),
      () =>
        axiosClient.get(
          `/nominee/${nomineeId}/permissions`,
        ),
    );
  },

  /**
   * Update nominee permissions.
   * PATCH /api/v1/nominees/{nomineeId}/permissions
   */
  updateNomineePermissions(
    nomineeId,
    permissionData,
  ) {
    if (!nomineeId) {
      throw new Error("Nominee ID is required.");
    }

    return tryAlternatePaths(
      () =>
        axiosClient.patch(
          `/nominees/${nomineeId}/permissions`,
          permissionData,
        ),
      () =>
        axiosClient.patch(
          `/nominee/${nomineeId}/permissions`,
          permissionData,
        ),
    );
  },

  /**
   * Remove document access.
   * DELETE /api/v1/nominees/{nomineeId}/documents/{documentId}
   */
  removeDocumentAccess(
    nomineeId,
    documentId,
  ) {
    if (!nomineeId || !documentId) {
      throw new Error(
        "Nominee ID and document ID are required."
      );
    }

    return axiosClient.delete(
      `/nominees/${nomineeId}/documents/${documentId}`,
    );
  },
};

export default nomineeApi;