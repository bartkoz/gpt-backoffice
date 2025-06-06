import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { login } from "../../shopify.server";

import indexStyles from "./style.css";

export const links = () => [{ rel: "stylesheet", href: indexStyles }];

export async function loader({ request }) {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return json({ showForm: Boolean(login) });
}

export default function App() {
  const { showForm } = useLoaderData();

  return (
    <div className="index">
      <div className="content">
        {showForm && (
          <Form method="post" action="/auth/login">
            <label>
              <input type="text" name="shop" />
            </label>
            <button type="submit">Log in</button>
          </Form>
        )}
      </div>
    </div>
  );
}
