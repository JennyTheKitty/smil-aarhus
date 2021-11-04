import jwtDecode from "jwt-decode";

class AccessToken {
  // The access_token is ephemeral and deliberately not set in localStorage/cookies
  accessToken = "";

  setToken(token: string) {
    this.accessToken = token;
  }

  getToken() {
    return this.accessToken;
  }

  isTokenValidOrUndefined() {
    const token = this.getToken();

    if (!token) {
      return true;
    }

    try {
      const { exp } = jwtDecode(token) as { exp: number };
      if (Date.now() >= exp * 1000) {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      return false;
    }
  }

  async fetchNewToken() {
    try {
      const res = await this.innerFetch();
      const data = JSON.parse(await res.text()) as {
        ok: boolean;
        access_token: string;
      };
      console.log(data);

      if (!data.ok || !data.access_token) {
        throw new Error("Error refreshing token.");
      }
      this.setToken(data.access_token);
    } catch (err) {
      this.handleFetchError(err as Error);
      throw new Error("Please login to continue.");
    }
  }

  innerFetch() {
    return fetch("/access_token", {
      method: "POST",
      credentials: "include",
    });
  }

  handleFetch(accessToken: string) {
    this.setToken(accessToken);
  }

  handleFetchError(err: Error) {
    console.warn("Your refresh token is invalid. Please try re-logging in.");
    console.error(err);
  }
}

export const accessToken = new AccessToken();
