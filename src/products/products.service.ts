import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  // CREATE
  async create(
    dto: CreateProductDto,
    image?: string,
  ): Promise<Product> {
    const product: Product = this.repo.create({
      name: dto.name,
      description: dto.description ?? null,
      price: dto.price,
      image: image ?? null,
    } as Product); // ÉP KIỂU RÕ RÀNG

    return await this.repo.save(product);
  }

  // READ ALL
  async findAll(): Promise<Product[]> {
    return await this.repo.find();
  }

  // READ ONE
  async findOne(id: number): Promise<Product> {
    const product = await this.repo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    return product;
  }

  // UPDATE
  async update(
    id: number,
    dto: UpdateProductDto,
    image?: string,
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined)
      product.description = dto.description;
    if (dto.price !== undefined) product.price = dto.price;
    if (image) product.image = image;

    return await this.repo.save(product);
  }

  // DELETE
  async remove(id: number): Promise<{ message: string }> {
    const product = await this.findOne(id);

    await this.repo.remove(product);

    return { message: 'Deleted successfully' };
  }
}
