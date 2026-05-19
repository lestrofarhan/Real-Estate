import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense, useState } from "react";

function ListPage() {
  const data = useLoaderData();
  const [focused, setFocused] = useState(null);

  const SkeletonList = ({ count = 6 }) => {
    return (
      <div className="skeleton list-skeleton">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`skeleton-card ${focused === i ? "focused" : ""}`}
            onClick={() => setFocused(focused === i ? null : i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") setFocused(focused === i ? null : i);
            }}
          >
            <div className="thumb" />
            <div className="lines">
              <div className="line short" />
              <div className="line long" />
              <div className="line medium" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const SkeletonMap = () => (
    <div className="skeleton map-skeleton">
      <div className="map-box">
        <div className="pin" />
        <div className="pulse" />
      </div>
    </div>
  );

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter />
          <Suspense fallback={<SkeletonList />}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) =>
                postResponse.data.map((post) => (
                  <Card key={post.id} item={post} />
                ))
              }
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="mapContainer">
        <Suspense fallback={<SkeletonMap />}>
          <Await
            resolve={data.postResponse}
            errorElement={<p>Error loading posts!</p>}
          >
            {(postResponse) => <Map items={postResponse.data} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export default ListPage;
