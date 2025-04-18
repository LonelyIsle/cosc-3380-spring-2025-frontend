import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App.jsx";
import { BrowserRouter } from "react-router-dom";
import { EmployeeProvider } from "@context/EmployeeContext.jsx";
import { CategoryProvider } from "@context/CategoryContext.jsx";
import { ProductProvider } from "@context/ProductContext.jsx";
import { CartProvider } from "@context/CartContext.jsx";
import { SaleProvider } from "@context/SalesContext";
import { CouponProvider } from "@context/CouponContext.jsx";
import { CustomerProvider } from "@context/CustomerContext.jsx";
import { ConfigProvider } from "@context/ConfigContext.jsx";
import { OrderProvider } from "@context/OrderContext.jsx";
import { NotificationProvider } from "@context/NotificationContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ProductProvider>
        <CategoryProvider>
          <CartProvider>
            <SaleProvider>
              <EmployeeProvider>
                <CouponProvider>
                  <CustomerProvider>
                    <ConfigProvider>
                      <OrderProvider>
                        <NotificationProvider>
                          <App />
                        </NotificationProvider>
                      </OrderProvider>
                    </ConfigProvider>
                  </CustomerProvider>
                </CouponProvider>
              </EmployeeProvider>
            </SaleProvider>
          </CartProvider>
        </CategoryProvider>
      </ProductProvider>
    </BrowserRouter>
  </StrictMode>,
);
