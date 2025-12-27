/**
 * Service for workspace-related API operations.
 */
export const workspaceService = {
  async inviteMember(email) {
    const response = await fetch('/api/workspaces/invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to invite member: ${response.statusText}`);
    }
    return await response.json();
  },

  async joinWorkspace(token, force = false) {
    const response = await fetch('/api/workspaces/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, force }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.error || `Failed to join workspace: ${response.statusText}`);
        error.data = errorData;
        throw error;
    }
    return await response.json();
  },

  async getWorkspace() {
    const response = await fetch('/api/workspace');
    if (!response.ok) {
        throw new Error(`Failed to fetch workspace: ${response.statusText}`);
    }
    return await response.json();
  },

  async removeMember(memberID) {
    const response = await fetch(`/api/workspaces/members/${memberID}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to remove member: ${response.statusText}`);
    }
  }
};
