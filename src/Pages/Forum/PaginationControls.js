// import { Pagination } from "react-bootstrap";

// const PaginationControls = () => (
//   <Pagination>
//     <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
//     <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />

//     {[...Array(totalPages).keys()].map((number) => (
//       <Pagination.Item
//         key={number + 1}
//         active={currentPage === number + 1}
//         onClick={() => setCurrentPage(number + 1)}
//       >
//         {number + 1}
//       </Pagination.Item>
//     ))}

//     <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
//     <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
//   </Pagination>
// );
