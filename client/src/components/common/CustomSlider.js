import React, { memo } from "react"
import Slider from "react-slick"
import { Product } from "components"

const CustomSlider = ({ products, activedTab, normal, slidesToShow = 3 }) => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
  }
  return (
    <>
      {products && (
        <Slider className="custom-slider" {...settings}>
          {products?.map((el, index) => (
            <Product
              key={index}
              pid={el._id}
              productData={el}
              isNew={activedTab === 1 ? false : true}
              normal={normal}
            />
          ))}
        </Slider>
      )}
    </>
  )
}

export default memo(CustomSlider)
