import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { FunctionComponent } from "react";

const Home: FunctionComponent = () => {
  const router = useRouter();
  const [{ account }, , removeCookies] = useCookies(["account"]);


  return (
    <section className="h-screen w-screen">
          </div>
        </div>
        <button
          type="button"
        >
        </button>
      </div>
    </section>
  );
};

export default Home;
