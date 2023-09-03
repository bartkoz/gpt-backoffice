import { Pagination } from "@shopify/polaris";

export default function PaginationComponent({
  paginationPage,
  setPaginationPage,
  pages,
  isLoading,
}) {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Pagination
        hasPrevious={paginationPage > 1 && !isLoading}
        hasNext={paginationPage < pages && !isLoading}
        onPrevious={() => {
          setPaginationPage((prevCount) => prevCount - 1);
        }}
        onNext={() => {
          setPaginationPage((prevCount) => prevCount + 1);
        }}
      />
    </div>
  );
}
