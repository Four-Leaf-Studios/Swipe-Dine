import { StyleSheet, View } from "react-native";
import React from "react";
import SwipeCard from "../components/SwipeCard";
import Box from "../components/Box";
import Text from "../components/Text";
import Button from "../components/Button";
import Logo from "../components/Logo";

type Props = {};

const Swipe = (props: Props) => {
  return (
    <>
      <Box
        width="100%"
        flex={1}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        gap="s"
        paddingLeft="m"
        paddingRight="m"
        paddingBottom="s"
      >
        <Logo variant="subheader" />
        <Text variant="subheader" color="orangeDark">
          Filter
        </Text>
      </Box>
      <SwipeCard
        title="title"
        subtitle="subtitle"
        description={
          "Description Description Description Description Description Description Description"
        }
        photos={[
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg_46CuoZjkg5C-nnW_XbHV-pftW0GdoZWBg&usqp=CAU",
          "https://scontent.ftpa1-2.fna.fbcdn.net/v/t39.30808-6/307314335_5655122674556643_1657747153723673069_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=l_BXiIM0IRAAX93YxJB&_nc_ht=scontent.ftpa1-2.fna&oh=00_AfDRNg-kNtQhQJYo4lQsqYqwzRkb5DnRPWmTi44oADvaVA&oe=647AE053",
          "https://scontent.ftpa1-2.fna.fbcdn.net/v/t39.30808-6/307314335_5655122674556643_1657747153723673069_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=l_BXiIM0IRAAX93YxJB&_nc_ht=scontent.ftpa1-2.fna&oh=00_AfDRNg-kNtQhQJYo4lQsqYqwzRkb5DnRPWmTi44oADvaVA&oe=647AE053",
          "https://scontent.ftpa1-2.fna.fbcdn.net/v/t39.30808-6/307314335_5655122674556643_1657747153723673069_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=l_BXiIM0IRAAX93YxJB&_nc_ht=scontent.ftpa1-2.fna&oh=00_AfDRNg-kNtQhQJYo4lQsqYqwzRkb5DnRPWmTi44oADvaVA&oe=647AE053",
          "https://scontent.ftpa1-2.fna.fbcdn.net/v/t39.30808-6/307314335_5655122674556643_1657747153723673069_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=l_BXiIM0IRAAX93YxJB&_nc_ht=scontent.ftpa1-2.fna&oh=00_AfDRNg-kNtQhQJYo4lQsqYqwzRkb5DnRPWmTi44oADvaVA&oe=647AE053",
          "https://scontent.ftpa1-2.fna.fbcdn.net/v/t39.30808-6/307314335_5655122674556643_1657747153723673069_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=l_BXiIM0IRAAX93YxJB&_nc_ht=scontent.ftpa1-2.fna&oh=00_AfDRNg-kNtQhQJYo4lQsqYqwzRkb5DnRPWmTi44oADvaVA&oe=647AE053",
          "https://scontent.ftpa1-2.fna.fbcdn.net/v/t39.30808-6/307314335_5655122674556643_1657747153723673069_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=l_BXiIM0IRAAX93YxJB&_nc_ht=scontent.ftpa1-2.fna&oh=00_AfDRNg-kNtQhQJYo4lQsqYqwzRkb5DnRPWmTi44oADvaVA&oe=647AE053",
          "https://scontent.ftpa1-2.fna.fbcdn.net/v/t39.30808-6/307314335_5655122674556643_1657747153723673069_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=l_BXiIM0IRAAX93YxJB&_nc_ht=scontent.ftpa1-2.fna&oh=00_AfDRNg-kNtQhQJYo4lQsqYqwzRkb5DnRPWmTi44oADvaVA&oe=647AE053",
          "https://scontent.ftpa1-2.fna.fbcdn.net/v/t39.30808-6/307314335_5655122674556643_1657747153723673069_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=l_BXiIM0IRAAX93YxJB&_nc_ht=scontent.ftpa1-2.fna&oh=00_AfDRNg-kNtQhQJYo4lQsqYqwzRkb5DnRPWmTi44oADvaVA&oe=647AE053",
        ]}
      />
    </>
  );
};

export default Swipe;

const styles = StyleSheet.create({});
