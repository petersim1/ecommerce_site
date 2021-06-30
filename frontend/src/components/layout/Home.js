import React, {Fragment,useState,useEffect} from 'react';
import MetaData from './MetaData'
import Loader from './Loader'

import {useDispatch,useSelector} from 'react-redux';
import {getProducts} from '../../actions/productActions';
import {useAlert} from 'react-alert';
import Pagination from 'react-js-pagination';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'

import Product from '../product/Product';


const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);


const Home = ({match}) => {

    const [curPage,setCurPage] = useState(1);
    const [visPrice,setVisPrice] = useState([1,1000]); //visual component for slider
    const [price,setPrice] = useState([1,1000]); // data component for actual backend filtering.
    const [category,setCategory] = useState('');
    const [rating,setRating] = useState(0);

    const alert = useAlert();
    const dispatch = useDispatch();

    const categories = [
        'Electronics',
        'Cameras',
        'Laptops',
        'Accessories',
        'Headphones',
        'Food',
        "Books",
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'
    ]

    const ratings = [5,4,3,2,1];

    const {
        loading,
        products,
        productsCount,
        error,
        resPerPage,
        filteredProductsCount
    } = useSelector(state => state.products);

    const keyword = match.params.keyword;

    useEffect(() => {
        if (error) {
            return alert.error(error)
        }
        dispatch(getProducts(keyword,curPage,price,category,rating))
    },[dispatch,alert,error,keyword,curPage,price,category,rating])
    
    return (
        <Fragment>
            {loading ? <Loader /> : (
            <Fragment>
                <MetaData title={'But Best Products Online'}/>
                <h1 id="products_heading">Latest Products</h1>
                <section id="products" className="container mt-5">
                    <div className="row">
                        {keyword ? (
                            <Fragment>
                                <div className='col-6 col-md-3 mt-5 mb-5'>
                                    <Range 
                                        marks={{
                                            1:'$1',
                                            1000:'$1000'
                                        }}
                                        min={1}
                                        max={1000}
                                        defaultValue={[1,1000]}
                                        tipFormatter={value => `$${value}`}
                                        tipProps={{
                                            placement:"top",
                                            visible:true
                                        }}
                                        value={visPrice}
                                        onChange={p => setVisPrice(p)}
                                        onAfterChange={p => setPrice(p)}
                                    />
                                    <hr className='my-5'/>
                                    <div className='mt-5'>
                                        <h4 className='mb-3'>
                                            Categories
                                        </h4>

                                        <ul className='pl-0'>
                                            {categories.map(cat => (
                                            <li 
                                                key={cat}
                                                onClick={() => setCategory(cat)}
                                                style={{
                                                    cursor:'pointer',
                                                    listStyleType:'none'
                                                }}>
                                                {cat}
                                            </li>  
                                            ))}
                                        </ul>
                                    </div>
                                    <hr className='my-5'/>
                                    <div className='my-3'>
                                        <div className='mt-5'>
                                            <h4 className='mb-3'>
                                                Ratings
                                            </h4>

                                            <ul className='pl-0'>
                                                {ratings.map(rating => (
                                                <li 
                                                    key={rating}
                                                    onClick={() => setRating(rating)}
                                                    style={{
                                                        cursor:'pointer',
                                                        listStyleType:'none'
                                                    }}>
                                                    <div className="rating-outer">
                                                        <div className="rating-inner" style={{width: `${100*rating/5}%`}}></div>
                                                    </div>
                                                </li>  
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-6 col-md-9'>
                                    <div className='row'>
                                        {products && products.map(product => (
                                            <Product key={product._id} product={product} col={4}/>
                                        ))}
                                    </div>
                                </div>
                            </Fragment>
                        ) : (
                            products && products.map(product => (
                                <Product key={product._id} product={product} col={3}/>
                            ))
                        )}
                    </div>
                </section>
                {resPerPage <= filteredProductsCount && (
                    <div className="d-flex justify-content-center mt-5">
                    <Pagination
                        activePage={curPage}
                        itemsCountPerPage={resPerPage}
                        totalItemsCount={productsCount}
                        onChange={pageNo => setCurPage(pageNo)}
                        nextPageText={'Next'}
                        prevPageText={'Prev'}
                        firstPageText={'First'}
                        lastPageText={'Last'}
                        itemClass="page-item"
                        linkClass="page-link"
                    />
                </div>
                ) }
            </Fragment>
            )}
        </Fragment>
    )
}

export default Home