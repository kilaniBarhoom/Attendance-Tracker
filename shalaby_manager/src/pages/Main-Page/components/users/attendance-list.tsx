const AttendanceList = ({
  attendance,
  isLoading,
}: {
  attendance: AttendanceType[];
  isLoading: boolean;
}) => {
  return (
    <div>
      <ul>
        {isLoading ? (
          <div>Liading...</div>
        ) : (
          attendance &&
          attendance.map((item) => (
            <li className="rounded-md p-4 border" key={item.id}>
              <p>{item.user.fullNameArabic}</p>
              <p>{item.date}</p>
              <p>{item.status}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AttendanceList;
