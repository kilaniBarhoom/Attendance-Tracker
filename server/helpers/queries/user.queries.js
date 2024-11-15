export const findAllUsers = ({ grouped, search, pageNumber }) => {
    let filter = []

    if (grouped) {
        filter = [
            {
                $sort: { createdAt: 1 } // Sort by createdAt in descending order
            },
            {
                $addFields: {
                    id: "$_id" // Add a new field 'id' with the value of '_id'
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the original '_id' field
                    id: 1,
                    role: "$role",
                    active: 1,
                    fullNameEnglish: 1,
                    fullNameArabic: 1,
                    email: 1,
                    phone: 1,
                    secondaryPhone: 1,
                    createdAt: 1,
                    updatedAt: 1
                    // Add other fields you need here
                }
            },
            {
                $group: {
                    _id: "$role", // Group by the role field
                    users: { $push: "$$ROOT" }, // Push the entire user document into the users array
                    count: { $sum: 1 } // Count the number of users in each role
                }
            },
            {
                $project: {
                    _id: 0,
                    role: "$_id",
                    users: 1,
                    count: 1 // Include the count in the output
                }
            }
        ]
    } else {
        // just return the users in the order when first created to last
        filter = [
            {
                $addFields: {
                    roleOrder: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$role", "superadmin"] }, then: 1 },
                                { case: { $eq: ["$role", "admin"] }, then: 2 },
                                { case: { $eq: ["$role", "user"] }, then: 3 },
                                { case: { $eq: ["$role", "spectator"] }, then: 4 }
                            ],
                            default: 5 // Assign a default value for any other roles
                        }
                    }
                }
            },
            {
                $sort: { roleOrder: 1 } // Sort by roleOrder first, then by createdAt
            },
            {
                $addFields: {
                    id: "$_id" // Add a new field 'id' with the value of '_id'
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the original '_id' field
                    role: "$role",
                    id: 1,
                    fullNameEnglish: 1,
                    fullNameArabic: 1,
                    active: 1,
                    phone: 1,
                    secondaryPhone: 1,
                    email: 1,
                    createdAt: 1,
                    updatedAt: 1
                    // Add other fields you need here
                }
            },
            {
                $project: {
                    roleOrder: 0 // Optionally exclude the roleOrder field from the final output
                }
            },
            {
                $skip: pageNumber * 10
            },
            { $limit: 10 }
        ];
    }

    if (search)
        filter.push({
            $match: {
                $or: [
                    { email: { $regex: search, $options: "i" } },
                    { fullNameArabic: { $regex: search, $options: "i" } },
                    { fullNameEnglish: { $regex: search, $options: "i" } },
                    { phone: { $regex: search, $options: "i" } },
                    { secondaryPhone: { $regex: search, $options: "i" } },
                ],
            },
        });

    return filter;

}