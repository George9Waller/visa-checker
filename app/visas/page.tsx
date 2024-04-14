export const dynamic = "force-dynamic";

import Link from "next/link";
import { getVisas } from "./server-actions";
import PrivateText from "../components/PrivateText";

export default async function Home() {
  const visas = await getVisas();

  return (
    <div className="card bg-base-100 p-6 w-full flex flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-lg flex-1">Visas</h1>
        <div className="flex-0 flex flex-row gap-2">
          <Link href="/visas/create" className="btn btn-primary">
            Create visa
          </Link>
          <Link href={"/"} className="btn btn-square flex-0">
            x
          </Link>
        </div>
      </div>
      <hr />
      <div className="flex flex-col">
        {visas.length === 0 && <p>You have no visas created</p>}
        {visas.map((visa) => (
          <div
            key={visa.id}
            className="rounded shadow-md p-4 flex flex-row items-center"
          >
            <h2 className="flex-1">
              {visa.name}
              {visa.visaNumber && (
                <>
                  {" "}
                  ·{" "}
                  <PrivateText>
                    <span className="font-mono">{visa.visaNumber}</span>
                  </PrivateText>
                </>
              )}
            </h2>
            <div className="flex-0 flex items-center gap-2">
              {!visa.expires || (visa.expires && visa.expires > new Date()) ? (
                <button className="btn btn-sm btn-outline btn-success">
                  ✅ In date
                  {visa.expires &&
                    ` until ${new Date(visa.expires).toLocaleDateString("en-GB")}`}
                </button>
              ) : (
                <button className="btn btn-sm btn-outline btn-error">
                  ❌ Expired{" "}
                  {visa.expires && new Date(visa.expires).toLocaleDateString("en-GB")}
                </button>
              )}
              <Link
                href={`/visas/${visa.id}`}
                className="btn btn-sm btn-outline"
              >
                Info
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
