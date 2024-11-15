export const findExpenses = (startDate, endDate, search) => {
    const filter = [];
    if (startDate)
        filter.push({
            $match: {
                createdAt: { $gte: new Date(startDate) },
            },
        });
    if (endDate)
        filter.push({
            $match: {
                createdAt: { $lte: new Date(endDate) },
            },
        });
    if (search)
        filter.push({
            $match: {
                $or: [
                    { description: { $regex: search, $options: "i" } },
                    { name: { $regex: search, $options: "i" } },
                ],
            },
        });

    filter.push({
        $sort: {
            createdAt: -1,
        },
    });
    filter.push({
        $project: {
            _id: 1,
            id: 1,
            createdAt: 1,
            amount: 1,
            description: 1,
            name: 1,
            user: 1,
            images: 1
        },
    });

    filter.push({
        $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userDetails'
        }
    });

    filter.push({
        $unwind: '$userDetails'
    });

    filter.push({
        $addFields: {
            'user.fullNameEnglish': '$userDetails.fullNameEnglish',
            'user.fullNameArabic': '$userDetails.fullNameArabic',
            'user.email': '$userDetails.email',
            'user.role': '$userDetails.role',
        }
    });

    filter.push({
        $project: {
            userDetails: 0
        }
    });
    return filter;
};

export const findValueSum = (_id) => {
    const filter = [
        {
            $group: {
                _id: null,
                total: { $sum: "$amount" },
            },
        },
    ];

    if (_id)
        filter.unshift({
            $match: {
                _id: { $in: _id },
            },
        });

    return filter;
};